import { notFound } from "next/navigation";
import { CHAINS, CHAIN_ORDER, type ChainId } from "@/lib/chains";
import { UploadPageClient } from "@/components/UploadPageClient";

export function generateStaticParams() {
  return CHAIN_ORDER.map((id) => ({ chain: id }));
}

export default function UploadRoutePage({
  params,
}: {
  params: { chain: string };
}) {
  const id = params.chain as ChainId;
  const chain = CHAINS[id];
  if (!chain) notFound();

  return <UploadPageClient chain={chain} />;
}
