import { ArticleReader } from "@/components/ArticleReader";

export default function ReadPage({ params }: { params: { id: string } }) {
  return <ArticleReader id={params.id} />;
}
