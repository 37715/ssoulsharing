"""Background removal for garment photos — crisp-edged.

True cutout, NOT regeneration: rembg outputs the original photo pixels with an
alpha mask applied — the garment is byte-for-byte the same, only the background
is removed. We then HARDEN the alpha so there is no soft, semi-transparent
fringe (the "blurred edge" look): threshold -> 1px erode -> minimal clean AA.

Run from the project root:  python scripts/cutout.py
"""
import sys
import pathlib

import numpy as np
from rembg import remove, new_session
from PIL import Image, ImageFilter

SRC = pathlib.Path("collection")
DST = pathlib.Path("cropped")
EXCLUDE = {"background.png"}              # not a garment
MODEL = "isnet-general-use"              # sharper masks than u2net

# alpha-hardening knobs
THRESH = 145        # cut anything below this -> fully transparent (kills fringe)
ERODE_PX = 1        # shrink the mask by N px to eat the outer halo ring
AA = 0.6            # tiny gaussian for clean (non-jagged) 1px edge

# web-asset knobs (the .webp the site actually loads)
WEB_MAX = 1000      # max side in px — plenty for tile + PDP display
WEB_QUALITY = 82    # alpha WebP quality


def harden_alpha(img: Image.Image) -> Image.Image:
    """Turn rembg's feathered alpha into a crisp edge."""
    r, g, b, a = img.split()
    # 1. binarize: no more partial transparency = no blur halo
    a = a.point(lambda v: 255 if v >= THRESH else 0)
    # 2. erode: eat the thin semi-transparent ring left around the garment
    if ERODE_PX:
        a = a.filter(ImageFilter.MinFilter(2 * ERODE_PX + 1))
    # 3. one sub-pixel blur then re-bias -> crisp edge with clean anti-alias
    a = a.filter(ImageFilter.GaussianBlur(AA))
    a = a.point(lambda v: 0 if v < 90 else (255 if v > 205 else v))
    return Image.merge("RGBA", (r, g, b, a))


def main() -> int:
    imgs = [p for p in SRC.glob("*/*.png") if p.name not in EXCLUDE]
    if not imgs:
        print("No source images found under collection/*/*.png")
        return 1

    session = new_session(MODEL)
    for p in sorted(imgs):
        out = DST / p.relative_to(SRC)
        out.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(p) as im:
            cut = remove(im.convert("RGBA"), session=session)
            cut = harden_alpha(cut)
            cut.save(out)                       # PNG master (lossless source)
            # web asset: resized alpha WebP — this is what the site loads
            web = cut
            s = min(1.0, WEB_MAX / max(web.size))
            if s < 1.0:
                web = web.resize(
                    (round(web.size[0] * s), round(web.size[1] * s)),
                    Image.LANCZOS)
            web.save(out.with_suffix(".webp"), "WEBP",
                     quality=WEB_QUALITY, method=6)
        print(f"{p}  ->  {out}  +  {out.with_suffix('.webp').name}")

    print(f"done: {len(imgs)} cutouts (png master + web webp) in {DST}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
