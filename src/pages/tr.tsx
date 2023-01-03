import { trpc } from "utils/trpc";

export default function TestPage() {
  const material = trpc.material.getAll.useQuery();
  if (!material.data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>{material.data[0]?.name}</p>
    </div>
  );
}
