/* Shared catalogue — single source of truth for product data.
   Used by product.html (page render) and cart.js (basket lines).
   Add a garment: new entry here + a tile in index.html. */
const CATALOG = {
  "hoodie-01": { type: "hoodie", no: "01", name: "hoodie 01", price: "€49",
    alt: "striped zip hoodie",
    images: ["cropped/hoodie/001.webp"],
    desc: "striped cotton zip-up hoodie.",
    spec: { material: "—", weight: "—", fit: "—", origin: "—" } },
  "hoodie-02": { type: "hoodie", no: "02", name: "hoodie 02", price: "€49",
    alt: "brown pullover hoodie",
    images: ["cropped/hoodie/002.webp"],
    desc: "boxy heavyweight pullover hoodie, faded brown.",
    spec: { material: "—", weight: "—", fit: "—", origin: "—" } },
  "shirt-01": { type: "shirt", no: "01", name: "shirt 01", price: "€49",
    alt: "shirt",
    images: ["cropped/shirt/001.webp"],
    desc: "basic white cotton tee.",
    spec: { material: "—", weight: "—", fit: "—", origin: "—" } },
  "henley-01": { type: "henley", no: "01", name: "henley 01", price: "€49",
    alt: "henley",
    images: ["cropped/henley/001.webp"],
    desc: "washed long-sleeve cotton henley.",
    spec: { material: "—", weight: "—", fit: "—", origin: "—" } },
  "jacket-01": { type: "jacket", no: "01", name: "jacket 01", price: "€49",
    alt: "jacket",
    images: ["cropped/jacket/001.webp"],
    desc: "corduroy hooded jacket, off-white.",
    spec: { material: "—", weight: "—", fit: "—", origin: "—" } }
};
const SIZES = ["xs", "s", "m", "l", "xl"];
