import React from "react";
import MainLayout from "layouts/mainLayout";
import ProfileLayout from "layouts/profile/layout";
//ui
import ProductImage from "@/ui/product-image";
import PriceWithLabel from "ui/price-with-label";
import Button from "ui/buttons";

import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getOrders } from "api";
export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery(["orders"], () => getOrders(), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <ProfileLayout>
      <h2 className="text-right p-5 text-lg font-bold w-full text-atysa-800">
        سفارش های من
      </h2>
      {isLoading ? (
        <span className="py-5">...</span>
      ) : (
        <div className="flex flex-col justify-center items-center w-full pb-10  gap-2">
          {orders?.map((order, i) => {
            return (
              <div
                key={order.id}
                className="flex justify-between p-5 items-center flex-col gap-2 w-full border-b-2 border-gray-200"
              >
                {order.basket_items.map(({ id, quantity, product }) => {
                  return (
                    <>
                      <div
                        key={id}
                        className="flex justify-between products-center w-full gap-1  "
                      >
                        <div className="flex gap-5 justify-center items-center products-center">
                          <div className="w-14 h-14">
                            <ProductImage src={product.defualtImage} />
                          </div>
                          <div>{product.name}</div>
                          <div>{quantity}x</div>
                        </div>
                      </div>
                    </>
                  );
                })}
                <div className="w-full flex justify-start items-center gap-2 ">
                  <div className="flex w-fit">
                    <PriceWithLabel
                      price={order.total_price * order.tax}
                      max={order.total_price.toString().length + 1}
                    />
                  </div>
                  <div className="flex w-fit">
                    <Button extraClass="bg-atysa-500">سفارش مجدد</Button>
                  </div>
                  <div className="flex w-fit">
                    <Button extraClass="bg-transparent ring-1 ring-inset ring-atysa-600 text-atysa-600">
                      مشاهده فاکتور
                    </Button>
                  </div>
                  <div className="flex w-fit">
                    {i === 0 ? (
                      <Button extraClass="px-2 rounded-full  bg-atysa-25 text-atysa-400">
                        سفارش در حال بررسی
                      </Button>
                    ) : (
                      <Button extraClass="px-2 rounded-full  bg-green-200 text-green-600">
                        سفارش تحویل داده شده
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ProfileLayout>
  );
}

export async function getServerSideProps(context) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["orders"], () => getOrders());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

OrdersPage.PageLayout = MainLayout;
