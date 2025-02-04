import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@prisma/client";
import { OrderStatus } from "@prisma/client";
import { withError, withSuccess } from "helpers/index";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import {
  createHandler,
  createMiddlewareDecorator,
  Get,
  ParseNumberPipe,
  Query,
  Req,
  UnauthorizedException,
  NextFunction,
  Post,
  Body,
  HttpCode,
  DefaultValuePipe,
  Put,
  Param,
  Delete,
  Header,
  SetHeader,
} from "next-api-decorators";

import { NextAuthGuard } from "server/common";

@NextAuthGuard()
class UserHandler {
  @Get("")
  async users(
    @Req() req: NextApiRequest,
    @Query("cursor") cursor: string,
    @Query("limit", DefaultValuePipe(2), ParseNumberPipe({ nullable: true }))
    limit?: number
  ) {
    let result: any = {
      error: true,
      message: "",
      data: {},
    };

    try {
      const users = await prisma.user.findMany({
        take: limit,
        cursor:
          cursor?.length === 24
            ? {
                id: cursor,
              }
            : undefined,
        skip: cursor && cursor?.length === 24 ? 1 : 0, // if skip is 1 it returns the first value twice, unless we are getting the first value in the db
        orderBy: {
          created_at: "desc",
        },
      });
      result = {
        error: false,
        message: "",
        data: {
          users,
          nextId:
            users.length === limit ? users[users.length - 1]?.id : undefined,
        },
      };
    } catch (e) {
      result.message = e;
    } finally {
      return result;
    }
  }
  @SetHeader("Access-Control-Allow-Origin", "google.com")
  @Get("/me")
  async me(@Req() req: NextApiRequest) {
    try {
      const user: any = await prisma.user.findUnique({
        where: {
          phonenumber: req.user?.phonenumber,
        },
      });
      if (!user) return "";
      delete user.code;
      return withSuccess({ data: { user } });
    } catch (e) {
      return withError({ message: "" });
    }
  }
  @Get("/orders")
  async orders(
    @Req() req: NextApiRequest,
    @Query("cursor") cursor: string,
    @Query("limit", DefaultValuePipe(4), ParseNumberPipe({ nullable: true }))
    limit?: number
  ) {
    let result: any = {
      error: true,
      message: "",
      data: {},
    };
    if (!req.user) return;
    try {
      const orders = await prisma.order.findMany({
        where: {
          user: {
            id: req.user.id,
          },
        },
        take: limit,
        cursor:
          cursor?.length === 24
            ? {
                id: cursor,
              }
            : undefined,
        skip: cursor && cursor?.length === 24 ? 1 : 0, // if skip is 1 it returns the first value twice, unless we are getting the first value in the db
        orderBy: {
          created_at: "desc",
        },
      });
      result = {
        error: false,
        message: "",
        data: {
          orders,
          nextId:
            orders.length === limit
              ? orders[orders?.length - 1]?.id
              : undefined,
        },
      };
    } catch (e) {
      result.message = e;
    } finally {
      return result;
    }
  }
  @Put("/me")
  async updateUser(
    @Req() req: NextApiRequest,
    @Body()
    body: any
  ) {
    try {
      const user = await prisma.user.update({
        where: {
          phonenumber: req.user?.phonenumber,
        },
        data: {
          ...body,
        },
      });
      return withSuccess({ data: { user } });
    } catch (e) {
      throw Error();
    }
  }
  @Put("/me/address/:id")
  async updateUserAddress(
    @Req() req: NextApiRequest,
    @Param("id") id: string,
    @Body()
    body: {
      address: {
        title: string;
        description: string;
        location: { lat: number; lon: number };
        phonenumber?: string;
        isActive: boolean;
      };
    }
  ) {
    try {
      const user = body.address.isActive
        ? await deActiveUserAdresses({
            phonenumber: req.user?.phonenumber,
          })
        : req.user;

      const addresses =
        user?.addresses.map((address) => {
          if (address.id === id) return body.address;
          return address;
        }) || [];

      const updatedUser = await prisma.user.update({
        where: {
          phonenumber: req.user?.phonenumber,
        },
        data: {
          addresses: {
            set: [...addresses],
          },
        },
      });
      return withSuccess({ data: { user: updatedUser } });
    } catch (e) {
      throw Error();
    }
  }

  @Post("/me/address")
  async createUserAddress(
    @Req() req: NextApiRequest,
    @Body()
    body: {
      address: {
        title: string;
        description: string;
        location: { lat: number; lon: number };
        isActive?: boolean;
      };
    }
  ) {
    try {
      const user = await deActiveUserAdresses({
        phonenumber: req.user?.phonenumber,
      });

      const updatedUser = await prisma.user.update({
        where: {
          phonenumber: req.user?.phonenumber,
        },
        data: {
          addresses: {
            set: [
              ...(user?.addresses || []),
              {
                ...body.address,
                isActive: true,
              },
            ],
          },
        },
      });
      return withSuccess({ data: { user: updatedUser } });
    } catch (e) {
      throw Error();
    }
  }
  @Delete("/me/address/:id")
  async deleteUserAddress(@Req() req: NextApiRequest, @Param("id") id: string) {
    try {
      const addresses = req.user?.addresses.filter(
        (address) => address.id !== id
      );
      const newAddresses =
        addresses?.length === 1
          ? addresses.map((address) => {
              address.isActive = true;
              return address;
            })
          : addresses || [];

      const result = await prisma.user.update({
        where: {
          phonenumber: req.user?.phonenumber,
        },
        data: {
          addresses: {
            set: [...newAddresses],
          },
        },
      });
      return withSuccess({ data: { user: result } });
    } catch (e) {
      // console.log(e);
      throw Error();
    }
  }
}

async function deActiveUserAdresses({
  phonenumber,
}: {
  phonenumber: string | undefined;
}) {
  const user = await prisma.user.findFirst({
    where: {
      phonenumber,
    },
  });
  user?.addresses.map((a) => {
    return (a.isActive = false);
  });
  return user;
}

export default createHandler(UserHandler);
