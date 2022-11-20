import Tag from "ui/tag";
export default function MaterialsList({
  className = "relative flex flex-row justify-center items-center gap-2 ",
  itemClass = "text-[0.8rem] py-[2px]",
  list = [],
  max,
}) {
  return (
    <div className={className}>
      {list.length > 0 && (
        <>
          {list.slice(0, max || list.length).map((item) => {
            return (
              <Tag key={item.id} extraClass={itemClass}>
                {item.name}
              </Tag>
            );
          })}
        </>
      )}
    </div>
  );
}
