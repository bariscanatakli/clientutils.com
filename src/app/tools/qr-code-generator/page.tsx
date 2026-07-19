import { buildPageMeta } from "@/lib/constants/seo";
import { getToolByPath } from "@/lib/constants/tools";
import QrClient from "./QrClient";

const tool = getToolByPath("/tools/qr-code-generator");

export const metadata = tool
  ? buildPageMeta({
      title: tool.name,
      description: tool.description,
      path: tool.path,
    })
  : {};

export default function QrGeneratorPage() {
  if (!tool) return <div>Tool not found</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
        <p className="text-lg text-muted-foreground">{tool.description}</p>
      </header>
      <QrClient />
    </div>
  );
}
