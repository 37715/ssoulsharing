/* Shared catalogue — single source of truth for product data.
   Used by product.html (page render) and cart.js (basket lines).
   Add a garment: new entry here + a tile in index.html. */
const CATALOG = {
  "hoodie-01": { type: "hoodie", no: "01", name: "hoodie 01", price: "€49",
    alt: "striped zip hoodie",
    images: ["cropped/hoodie/001.webp"],
    desc: "heavyweight loopback cotton, garment-dyed. boxy and unfussy — built to be worn for years, not seasons.",
    spec: { material: "—", weight: "—", fit: "—", origin: "—" } },
  "hoodie-02": { type: "hoodie", no: "02", name: "hoodie 02", price: "€49",
    alt: "brown pullover hoodie",
    images: ["cropped/hoodie/002.webp"],
    desc: "a relaxed pullover hoodie in faded brown cotton. one shape, no logo, made to be kept.",
    spec: { material: "—", weight: "—", fit: "—", origin: "—" } },
  "shirt-01": { type: "shirt", no: "01", name: "shirt 01", price: "€49",
    alt: "shirt",
    images: ["cropped/shirt/001.webp"],
    desc: "a plain everyday tee in slubbed cotton. one shape, no branding, made to last.",
    spec: { material: "—", weight: "—", fit: "—", origin: "—" } },
  "henley-01": { type: "henley", no: "01", name: "henley 01", price: "€49",
    alt: "henley",
    images: ["cropped/henley/001.webp"],
    desc: "long-sleeve henley in washed cotton. quiet, durable, season-agnostic.",
    spec: { material: "—", weight: "—", fit: "—", origin: "—" } },
  "jacket-01": { type: "jacket", no: "01", name: "jacket 01", price: "€49",
    alt: "jacket",
    images: ["cropped/jacket/001.webp"],
    desc: "a structured cotton jacket with utilitarian lines. nothing seasonal in it.",
    spec: { material: "—", weight: "—", fit: "—", origin: "—" } }
};
const SIZES = ["xs", "s", "m", "l", "xl"];
