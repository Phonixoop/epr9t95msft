import React, { useEffect, useState } from "react";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

import ProductForm from "@/features/admin/product/form";
// with
import withLabel from "@/ui/froms/with-label";
import withValidation from "@/ui/froms/with-validation";

//ui
import Button from "@/ui/buttons";
import TextField from "@/ui/froms/text-field";

const TextFieldWithLabel = withLabel(TextField);

const TextFieldWithValidation = withValidation(TextFieldWithLabel);

//icons
import Upload from "@/ui/icons/upload";
import { getProductBySlug, updateProduct, deleteProduct } from "api";
import { useRouter } from "next/router";

// const getProduct = async (slug) => {
//   return await (
//     await fetch(`http://localhost:3000/api/products?slug=${slug}`)
//   ).json();
// };

const isEmpty = (text) =>
  text?.length > 0 ? "" : "این فیلد نباید خالی رها شود";
const isEnglish = (text) =>
  !(text.match(/^[a-zA-Z0-9-]+$/) === null)
    ? ""
    : "فقط عدد و حروف انگلیسی مجاز است";

export default function ProductDetails({ slug }) {
  const router = useRouter();

  const {
    data: productData,
    isLoading,
    isFetching,
  } = useQuery(["products", slug], () => getProductBySlug(slug), {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    cacheTime: 0,
  });

  const updateProductMutate = useMutation(
    ({ id, product }) => updateProduct({ id, product }),
    {
      onSettled: (data) => {
        if (!!!data) return;
        router.replace(
          `/admin/products/?slug=${data.slug}`,
          `/admin/products/${data.slug}`,
          { shallow: true }
        );
      },
    }
  );

  const deleteProductMutate = useMutation(({ id }) => deleteProduct({ id }), {
    onSettled: (data) => {
      if (!!!data) return;
      router.replace(`/admin/products/`, `/admin/products/`);
    },
  });

  const isProductLoading = isLoading || isFetching || !productData;

  function handleSubmit(data) {
    updateProductMutate.mutate({
      id: data.id,
      product: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: data.isActive,
      },
    });
  }
  function handleDelete(id) {
    deleteProductMutate.mutate({
      id: id,
    });
  }

  return (
    <div className="flex flex-grow w-full justify-center overflow-y-auto">
      <div className="flex flex-1 p-10 flex-grow justify-center items-start">
        {isProductLoading ? (
          <FormSkeleton />
        ) : (
          <ProductForm
            formData={productData}
            isLoading={
              updateProductMutate.isLoading || deleteProductMutate.isLoading
            }
            onSubmit={(e, data) => handleSubmit(e, data)}
            onDelete={(id) => handleDelete(id)}
          />
          // <MyForm form={productData} />
        )}
      </div>
    </div>
  );
}

function HandleLoading({ children, isBusy, fallback }) {
  return <>{isBusy ? fallback : children}</>;
}

function MyForm({ children, form = {}, onSubmit = () => {} }) {
  const [data, setData] = useState(form);
  return (
    <form className="w-full flex flex-col gap-4" onSubmit={onSubmit(data)}>
      {form?.map(({ label, value, validations, Component }, index) => {
        return (
          <>
            <Component
              key={index}
              label={label}
              value={data[index].value}
              validations={validations}
              onValidation={(validations) =>
                setData(
                  data.map((field) => {
                    if (field.id != data[index].id) return field;
                    return {
                      ...field,
                      validations,
                    };
                  })
                )
              }
              onChange={(value) =>
                setData(
                  data.map((field) => {
                    if (field.id != data[index].id) return field;
                    return {
                      ...field,
                      value,
                    };
                  })
                )
              }
            />
          </>
        );
      })}
    </form>
  );
}

function FormSkeleton() {
  return (
    <>
      <div className="flex flex-grow w-full justify-center overflow-y-auto">
        <div className="flex flex-col justify-center items-start w-full gap-11">
          <div className="w-full h-12 bg-gray-300 animate-pulse rounded-xl" />
          <div
            dir="rtl"
            className="flex w-full desktop:flex-row flex-col justify-start items-stretch gap-5"
          >
            <div className="flex flex-col desktop:w-1/2 w-full gap-5 flex-1 ">
              <div className="w-full  h-12 bg-gray-300 animate-pulse rounded-xl" />
              <div className="w-full  h-12 bg-gray-300 animate-pulse rounded-xl" />
            </div>

            <div className="flex justify-center items-center bg-gray-300 desktop:flex-1 desktop:h-auto h-28 rounded-xl" />
          </div>
          <div className="w-11 h-10 bg-gray-300 rounded-xl" />
          <div className="flex flex-col w-full gap-2">
            <div className="w-full h-10 bg-gray-300 rounded-xl" />
            <div className="w-full h-10 bg-gray-300 rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}
