import { staticPage } from "@/lib/static";

export async function generateStaticParams() {
  return ["about", "contact", "faq", "terms", "privacy", "shipping-policy", "return-policy"].map((slug) => ({ slug }));
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = staticPage(slug);
  return (
    <div className="mx-auto max-w-2xl py-10">
      <h1 className="text-2xl font-bold">{p.title}</h1>
      <div className="mt-3 space-y-2 rounded-2xl border bg-white p-5 text-sm text-gray-700">
        {p.body.map((b, i) => <p key={i}>{b}</p>)}
      </div>
    </div>
  );
}
