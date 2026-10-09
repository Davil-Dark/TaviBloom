const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=60, s-maxage=60",
  "X-Content-Type-Options": "nosniff",
};

export async function onRequestGet({ env }) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: "Database binding DB is not configured." }), { status: 503, headers });
  }
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, slug, name, category, price_cents, image_url, label, type, emoji, background_color, description, details_json, age_label
       FROM products WHERE is_active = 1 ORDER BY id ASC`
    ).all();
    const products = results.map((p) => ({
      id: p.id, slug: p.slug, name: p.name, category: p.category,
      price: p.price_cents / 100, image: p.image_url, label: p.label, type: p.type,
      emoji: p.emoji, bg: p.background_color, desc: p.description,
      details: JSON.parse(p.details_json || "[]"), age: p.age_label,
    }));
    return new Response(JSON.stringify({ products, count: products.length }), { status: 200, headers });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Could not load products." }), { status: 500, headers });
  }
}
