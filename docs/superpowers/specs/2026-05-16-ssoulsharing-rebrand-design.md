# ssoulsharing rebrand — de-theming design

Date: 2026-05-16

## Goal

Reposition the storefront away from its original identity (luxury European
designer, football maillots, FIFA World Cup MMXXVI, Italy) toward a plainer,
longer-term, more brutalist direction. New garments and imagery will be chosen
later by the owner — this change removes the old theme and reorients the voice;
it does not invent a new brand story.

## Constraints (from the owner)

- Nothing football / World Cup / maillots related.
- No luxury-European-maison / Italy / French-Parisian framing.
- Less trend / hype / limited-edition framing; more long-term and durable.
- Less fancy, more brutalist.
- **Retain the exact layout for the clothing list and prices.** Product names,
  prices, images, and grid markup are NOT touched (owner will swap garments).
- Visual restyle deferred: copy/text only for now; CSS untouched except the one
  rule required to place the new logo.
- Use the supplied logo `logo/ssoulsharing.png` (transparent background,
  heavy bold lowercase wordmark).

## Voice

**A — Bare functional** (chosen): plain factual labels, no taglines, no hype.
Fits brutalist + long-term + not-trend, and avoids locking in a brand story
before the owner has chosen products/imagery.

## index.html (copy/text only; product list, prices, grid, CSS retained)

| Element        | Before                                   | After                                  |
|----------------|------------------------------------------|----------------------------------------|
| `<title>`      | `ssoulsharing — Drop 01`                 | `ssoulsharing`                         |
| `.title` line  | `Drop 01 / 3 Maillots / Edition 300`     | `Catalogue / 3 Items`                  |
| Masthead brand | text `ssoulsharing`                      | `<img src="logo/ssoulsharing.png" alt="ssoulsharing">` |
| Footer spans   | `ssoulsharing` · `Biella, Italia` · `MMXXVI` | `ssoulsharing` · `Catalogue` · `©` |

CSS: add exactly one targeted rule to size the logo:
`.mast .brand img { height: clamp(40px, 6vw, 72px); width: auto; display: block; }`
This is a placement necessity, not the deferred visual restyle. Existing
`.mast .brand` font rules become inert (no text node) and are left as-is.

Footer text is uppercased by existing CSS (`text-transform: uppercase`), so the
footer wordmark renders `SSOULSHARING` — accepted as a utilitarian label; no CSS
change to override it.

Product names (`Bloom`, `Tide`, `Verde`), prices (`€49`), `alt` text, image
paths, and grid markup are **unchanged**. `Verde` is intentionally retained as
part of the owner-controlled product list.

## README.md (de-theme; keep technical guidance)

Remove all old-identity flavor while keeping the Shopify/Hydrogen/Liquid/Next.js
porting guidance and code samples:

- Title/intro → plain description: a custom storefront for the ssoulsharing
  clothing catalogue. Remove "Atelier of the Game", "luxury maison", "football
  maillots", "World Cup MMXXVI", "editorial/bespoke" luxury framing (keep the
  neutral technical rationale for a custom storefront vs. a stock theme).
- Code samples kept; themed bits neutralized:
  - vendor comment `# use as "country"` → neutral label comment
  - swatch fallback `'swatch--it'` → `'swatch--01'`
  - collection `mondiale-mmxxvi` → `catalogue`
  - swatch values `swatch--ar/br/fr` → `swatch--01/02/03`
  - French country examples (Argentine, Brésil, …) removed
- "Notes on the design" → rewritten to describe the **actual** current minimal
  page (the section currently describes an unimplemented Bodoni/oxblood/French
  luxury system), plus a one-line forward note that the visual identity is
  moving to a plainer, longer-term direction with garments/imagery TBD. Drop
  Roman-numeral-year device, oxblood accent, French-country localization framing.
- "What's not in the prototype yet" → keep the list (PDP, cart, account,
  search); replace luxury aesthetic prescriptions ("from the atelier", "bone
  paper", "italic display serif") with plain restraint/durability guidance.

## Out of scope

- Visual/CSS restyle toward brutalism (deferred until new garments/imagery).
- Product/price/image changes (owner will supply).
- Folder rename `gsa` → `ssoulsharing` (blocked by the running session; manual
  step documented separately).

## Notes

This environment is not a git repository, so the design doc is written for the
record but not committed. The change is a focused two-file copy edit; no
separate multi-step implementation plan is warranted.
