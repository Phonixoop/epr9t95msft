import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import List from "@/ui/list";
//icons
import CategoryIcon from "ui/icons/category";
import Image from "next/image";

function OrdersImageIcon() {
  return <Image src="/images/image-icons/orders.png" width="16" height="16" />;
}

function ProductsImageIcon() {
  return (
    <Image src="/images/image-icons/products.png" width="16" height="16" />
  );
}
function GalleryImageIcon() {
  return <Image src="/images/image-icons/gallery.png" width="16" height="16" />;
}
function CouponImageIcon() {
  return <Image src="/images/image-icons/coupon.png" width="16" height="16" />;
}

const menuItems = [
  {
    url: "/admin/gallery",
    name: "رسانه ها",
    Icon: GalleryImageIcon,
  },
  {
    url: "/admin/categories",
    name: "دسته بندی ها",
    Icon: CategoryIcon,
  },
  {
    url: "/admin/products",
    name: "محصول ها",
    Icon: ProductsImageIcon,
  },
  {
    url: "/admin/orders",
    name: "سفارش ها",
    Icon: OrdersImageIcon,
  },
  {
    url: "/admin/coupons",
    name: "کد تخفیف",
    Icon: CouponImageIcon,
  },
];
console.log({ menuItems });
export default function AdminLayout({ children }) {
  const { asPath } = useRouter();
  const pathName = getPathName(asPath);
  return (
    <div
      dir="rtl"
      className="flex flex-col justify-start items-center min-h-screen "
    >
      <div className="flex items-center bg-white w-[80vw] mr-[15vw] text-right justify-start my-3 p-5 rounded-xl h-14 sticky top-1 z-10 drop-shadow-lg"></div>
      <div className="flex  justify-center items-start overflow-overlay ">
        <div className=" fixed h-full top-0 right-0  overflow-hidden p-2  min-w-[15vw]">
          <AsideMenu path={pathName} />
        </div>
        <div className="flex flex-col relative justify-center items-center py-3 w-[80vw] mr-[15vw]">
          {children}
        </div>
      </div>
    </div>
  );
}

function AsideMenu({ path }) {
  return (
    <>
      <div className="flex flex-col gap-5 bg-atysa-primary  divide-y divide-gray-100 justify-center items-center w-10/12 h-full px-2 rounded-3xl ">
        {menuItems.map((item) => {
          const Icon = item?.Icon;
          return renderMenuItem(
            item.name,
            item,
            Icon,
            getPathName(item.url) === path
          );
        })}
      </div>
    </>
  );
}

function renderMenuItem(key, item, Icon, active = false) {
  const { url, name } = item;
  const activeClass = active
    ? "shadow-full bg-white shadow-gray-200 text-atysa-main -translate-x-2 "
    : " shadow-inset text-atysa-900 stroke-atysa-main";

  return (
    <Link key={key} href={url} shallow={true}>
      <span
        className={`${activeClass} flex justify-center gap-10 items-center font-bold cursor-pointer px-2 py-2 w-full rounded-md text-center hover:scale-105 transition-transform duration-5000`}
      >
        <Icon
          fill={`${active ? "fill-atysa-main" : "fill-none"}`}
          stroke="stroke-inherit"
        />
        <span className="flex-grow flex justify-start">{name}</span>
      </span>
    </Link>
  );
}

function getPathName(path = "") {
  return path.substring(path.lastIndexOf("/") + 1);
}
