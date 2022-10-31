import React from "react";
import MainWithCategoryLayout from "layouts/mainWithCategoryLayout";
import ProductList from "features/productList";
import { getProductsByCategorySlug } from "api";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { prisma } from "@prisma/client";

export default function ShowProductsBySlugPage({ slug }) {
  const { data: products, isLoading } = useQuery(["products", slug], () =>
    getProductsByCategorySlug(slug)
  );
  if (isLoading) return "loading...";
  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-blue-50 min-h-full my-5">
      {products?.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <h1 className="w-full top-1/2 text-center text-2xl">
          محصولی در این دسته وجود ندارد
        </h1>
      )}
    </div>
  );
}

ShowProductsBySlugPage.PageLayout = MainWithCategoryLayout;

export async function getServerSideProps(context) {
  const { slug } = context.params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["products", slug], () =>
    getProductsByCategorySlug(slug)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      slug,
    },
  };
}
