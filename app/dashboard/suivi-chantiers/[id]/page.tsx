import BpuLigneClient from "./BpuLigneClient";

export default async function ChantierDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return <BpuLigneClient chantierId={id} />;
}
