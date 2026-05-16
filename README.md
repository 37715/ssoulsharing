# ssoulsharing

Storefront for ssoulsharing, a clothing catalogue.

`index.html` is a **single-file design prototype** — open it in a browser. It is the source of truth for the visual system: the typography, palette, layout proportions, motion, and component anatomy. Once you're happy with the look, port it to Shopify using the path below.

---

## Plugging into Shopify

You have three real options. They're listed in the order I'd actually recommend for this project.

### 1. Shopify Hydrogen — recommended

Hydrogen is Shopify's official React framework (built on Remix). It's the modern way to build a custom storefront against the Storefront API, and it deploys to Shopify's edge runtime (Oxygen) for free with any Shopify plan.

**Why Hydrogen here**: this design is custom — not a stock theme. Hydrogen lets you keep every pixel of the prototype, render real products from Shopify, and get fast checkout via Shopify's checkout — without fighting Liquid's templating model.

**Setup**:

```bash
npm create @shopify/hydrogen@latest ssoulsharing-storefront
cd ssoulsharing-storefront
npm install
npm run dev
```

That gives you a Remix project with a working Storefront API client.

**Porting the design**:

1. Copy the `<style>` block from `index.html` into `app/styles/app.css` (or split into `tokens.css` + `layout.css` + `components.css`).
2. Break the HTML into Remix route components:
   - `app/root.tsx` — masthead, footer
   - `app/routes/_index.tsx` — catalogue grid
   - `app/routes/collections.$handle.tsx` — collection grid (data-driven)
   - `app/routes/products.$handle.tsx` — single product PDP
3. Replace the hardcoded product cards with a `useLoaderData` query. Example for the collection grid:

```ts
// app/routes/collections.$handle.tsx
import { json } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';

export async function loader({ params, context }) {
  const { collection } = await context.storefront.query(`#graphql
    query Collection($handle: String!) {
      collection(handle: $handle) {
        title
        products(first: 24) {
          nodes {
            id
            handle
            title
            vendor                       # optional secondary label
            priceRange { minVariantPrice { amount currencyCode } }
            featuredImage { url altText }
            metafield(namespace: "ssoulsharing", key: "swatch_class") { value }
          }
        }
      }
    }
  `, { variables: { handle: params.handle } });

  return json({ collection });
}

export default function Collection() {
  const { collection } = useLoaderData<typeof loader>();
  return (
    <section className="collection">
      <div className="col-grid stagger">
        {collection.products.nodes.map((p, i) => (
          <article key={p.id} className="card">
            <a href={`/products/${p.handle}`}>
              <div className={`swatch ${p.metafield?.value ?? 'swatch--01'}`}>
                <span className="corner">No. {String(i + 1).padStart(2, '0')}</span>
                <span className="quick">View →</span>
              </div>
            </a>
            <div>
              <div className="row">
                <div className="num">No. {String(i + 1).padStart(2, '0')}</div>
                <div className="label">{p.vendor}</div>
              </div>
              <div className="row">
                <div className="name" dangerouslySetInnerHTML={{ __html: p.title }} />
                <div className="price">€ {Number(p.priceRange.minVariantPrice.amount).toLocaleString()}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

**Shopify admin setup** (one-time):
- Create a collection called `catalogue`.
- For each garment, create a product. Use the **Vendor** field for an optional secondary label if you want a small second line in the grid.
- Add a product **metafield** under namespace `ssoulsharing`, key `swatch_class`, type single-line text. Values: `swatch--01`, `swatch--02`, `swatch--03`, etc. — these map to the abstract CSS panels in the prototype until you have real photography.
- Once you have product photography, swap the `<div class="swatch">` for `<img>` and remove the metafield wiring.

**Cart & checkout**: Hydrogen ships a `<CartProvider>` and `useCart()` hook. The little `Cart (n)` indicator in the masthead becomes:

```tsx
import { useCart } from '@shopify/hydrogen-react';
const { totalQuantity } = useCart();
// ... <span>Cart ({totalQuantity ?? 0})</span>
```

Checkout itself is a hosted Shopify URL — `cart.checkoutUrl` — so you redirect there at the end of the cart flow. PCI / payments / fraud are all Shopify's problem, not yours.

**Deploy**: `npx shopify hydrogen deploy` pushes to Oxygen (free, edge-rendered, attached to your Shopify plan).

---

### 2. Liquid theme — if you want to stay inside Shopify's admin

If your team would rather edit the site through Shopify's theme editor (no Node deploy step, drag-and-drop sections), convert the prototype to a Liquid theme.

The translation is mostly mechanical:

```liquid
{%- comment -%} sections/featured.liquid {%- endcomment -%}
<section class="featured">
  <div class="section-head">
    <h3>{{ section.settings.heading }}</h3>
  </div>
  <div class="featured-grid stagger">
    {%- for block in section.blocks -%}
      {%- assign product = all_products[block.settings.product] -%}
      <article class="feat">
        <a href="{{ product.url }}">
          <div class="swatch {{ product.metafields.ssoulsharing.swatch_class }}">
            <span class="corner">No. {{ forloop.index | prepend: '0' | slice: -2, 2 }}</span>
            <span class="quick">View →</span>
          </div>
        </a>
        <div class="feat-caption">
          <div class="name">{{ product.title }}</div>
          <div class="price">{{ product.price | money }}</div>
          <p class="desc">{{ product.description | strip_html | truncate: 140 }}</p>
        </div>
      </article>
    {%- endfor -%}
  </div>
</section>

{% schema %}
{
  "name": "Featured",
  "settings": [{ "type": "text", "id": "heading", "label": "Heading" }],
  "blocks": [{ "type": "product", "settings": [{ "type": "product", "id": "product", "label": "Product" }] }],
  "presets": [{ "name": "Featured" }]
}
{% endschema %}
```

Use **Dawn** as the starting theme (`shopify theme init`), drop the CSS into `assets/ssoulsharing.css`, link it from `layout/theme.liquid`, then carve each section of `index.html` into its own `sections/*.liquid` file. The collection grid maps cleanly to a `collection.liquid` template.

Cost: the theme editor stays usable, but you lose the ergonomics of React. For a design this minimal, Liquid is fine.

---

### 3. Next.js + Storefront API — if you have an existing Next codebase

If you're already on Vercel/Next, you can hit the Storefront API directly and host wherever you want. Same data model as Hydrogen, no Remix lock-in. Use this if Hydrogen doesn't fit your team's stack — otherwise prefer Hydrogen, since Shopify supports it as a first-party product.

---

## Notes on the design

A few intentional choices worth preserving when you port it:

- **One typeface**: Archivo, used at a few weights only. No decorative display face.
- **Monochrome**: near-black `#0A0908` on white `#fff`. No accent colour.
- **Restraint over ornament**: tight grid, images meet edge-to-edge, plain name/price captions, uppercase tracked utility labels. Keep it plain.
- **Placeholder product panels**: the CSS swatches are stand-ins for real product photography. Ship with them while you photograph the real garments, then swap to `<img>` later without touching the layout.
- **Direction**: the visual identity is moving toward a plainer, longer-term, more brutalist direction. Garments and imagery are still to be chosen — avoid decorative flourishes that pin the design to a trend.

## What's not in the prototype yet

The prototype is the homepage and collection grid. You'll still need to design and build:

- Single product (PDP) — image, title, price, size selector, single primary CTA. Keep it plain and functional.
- Cart drawer (Hydrogen has a default — restyle to match).
- Account / order history (Shopify provides; restyle).
- A search results page.

These should follow the same rules: monochrome, plain type, generous whitespace, no decorative flourish.
