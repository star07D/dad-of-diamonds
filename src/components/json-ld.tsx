/**
 * Renders a <script type="application/ld+json"> block. Escaping `<` stops a
 * value like a product name containing "</script>" from breaking out of the
 * tag — JSON.stringify alone doesn't guard against that.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
