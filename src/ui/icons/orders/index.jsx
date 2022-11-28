export default function OrdersIcon({ className = "h-6 w-6 fill-gray-700" }) {
  return (
    <div className="flex justify-center items-center">
      <svg className={className} viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M5.833 2.5c-.92 0-1.666.746-1.666 1.667v13.01l1.403-.468a.833.833 0 01.573.017l1.774.71 1.774-.71c.198-.08.42-.08.618 0l1.774.71 1.774-.71a.833.833 0 01.573-.017l1.403.468V4.167c0-.92-.746-1.667-1.666-1.667H5.833zM2.5 4.167A3.333 3.333 0 015.833.833h8.334A3.333 3.333 0 0117.5 4.167v14.166a.833.833 0 01-1.097.79l-2.21-.736-1.8.72a.833.833 0 01-.62 0L10 18.397l-1.774.71a.833.833 0 01-.619 0l-1.8-.72-2.21.737a.833.833 0 01-1.097-.79V4.166zm4.167 1.666c0-.46.373-.833.833-.833h5a.833.833 0 010 1.667h-5a.833.833 0 01-.833-.834zm0 4.167c0-.46.373-.833.833-.833h5a.833.833 0 010 1.666h-5A.833.833 0 016.667 10zm0 4.167c0-.46.373-.834.833-.834h5a.833.833 0 010 1.667h-5a.833.833 0 01-.833-.833z"
          clipRule="evenodd"
        ></path>
      </svg>
    </div>
  );
}
