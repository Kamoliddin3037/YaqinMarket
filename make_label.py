"""
Mahsulot narx yorlig'i (price label) generatori.
Sariq fonda EAN-13 barkodli narx yorlig'i.

O'rnatish:
    pip install python-barcode Pillow

Ishlatish:
    python3 make_label.py
    python3 make_label.py --name "Coca-Cola 1L" --price "9 200 UZS" --barcode 8600000012345 --shop INBAZAR --count 4
"""

import barcode
from barcode.writer import ImageWriter
from PIL import Image, ImageDraw, ImageFont
import io
import os
import sys
import argparse

# ── Ranglar ──────────────────────────────────────────────────────
YELLOW   = (245, 200, 30)
BLACK    = (20, 20, 20)
GRAY     = (90, 90, 90)
DK_GRAY  = (50, 50, 50)

# ── Shrift topish (macOS / Linux / Windows) ───────────────────────
def _find_font(bold=False):
    candidates = {
        'darwin': {
            False: [
                '/System/Library/Fonts/Supplemental/Arial.ttf',
                '/Library/Fonts/Arial Unicode.ttf',
                '/System/Library/Fonts/Helvetica.ttc',
            ],
            True: [
                '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
                '/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf',
                '/System/Library/Fonts/Supplemental/Arial Black.ttf',
                '/System/Library/Fonts/ArialHB.ttc',
                '/System/Library/Fonts/Helvetica.ttc',
            ],
        },
        'win32': {
            False: ['C:/Windows/Fonts/arial.ttf'],
            True:  ['C:/Windows/Fonts/arialbd.ttf', 'C:/Windows/Fonts/ariblk.ttf'],
        },
        'linux': {
            False: [
                '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
                '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
                '/usr/share/fonts/truetype/freefont/FreeSans.ttf',
            ],
            True: [
                '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
                '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
                '/usr/share/fonts/truetype/freefont/FreeSansBold.ttf',
            ],
        },
    }
    plat = 'darwin' if sys.platform == 'darwin' else ('win32' if sys.platform == 'win32' else 'linux')
    for path in candidates[plat][bold]:
        if os.path.exists(path):
            return path
    return None


def _load_font(size, bold=False):
    path = _find_font(bold)
    if path:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    return ImageFont.load_default()


# ── EAN-13 raqamini formatlash: "2 000000 011936" ────────────────
def _fmt_ean13(code: str) -> str:
    c = code.strip()
    if len(c) == 13:
        return f"{c[0]} {c[1:7]} {c[7:]}"
    return c


# ── Bitta yorliq yaratish ─────────────────────────────────────────
def make_label(
    product_name: str = "FWorld Accent deo 200ml",
    price: str        = "34 000 UZS",
    shop: str         = "INBAZAR",
    barcode_number: str = "2000000011936",
    out_path: str     = "label.png",
    width_px: int     = 900,
    height_px: int    = 600,
) -> str:
    """
    Sariq narx yorlig'i rasmini yaratadi va saqlaydi.

    Parametrlar:
        product_name   — mahsulot nomi
        price          — narx (masalan: "34 000 UZS")
        shop           — do'kon/platforma nomi (masalan: "INBAZAR")
        barcode_number — EAN-13 (13 ta raqam); qisqaroq bo'lsa CODE128 ishlatiladi
        out_path       — saqlash manzili (.png)
        width_px       — rasm kengligi pikselda (default 900)
        height_px      — rasm balandligi pikselda (default 600)

    Qaytaradi:
        Saqlangan fayl yo'li
    """
    W, H = width_px, height_px
    MARGIN = int(W * 0.05)

    img  = Image.new("RGB", (W, H), YELLOW)
    draw = ImageDraw.Draw(img)

    # ── Shriftlar ────────────────────────────────────────────────
    f_name  = _load_font(int(H * 0.072), bold=False)   # mahsulot nomi
    f_small = _load_font(int(H * 0.052), bold=False)   # НОМИ-НАРХИ СУМ
    f_price = _load_font(int(H * 0.185), bold=True)    # narx (eng katta)
    f_shop  = _load_font(int(H * 0.048), bold=False)   # do'kon nomi

    # ── Markazga tekislash yordamchisi ───────────────────────────
    def cx(text, font, y, fill=BLACK):
        bbox = draw.textbbox((0, 0), text, font=font)
        tw   = bbox[2] - bbox[0]
        draw.text(((W - tw) / 2, y), text, font=font, fill=fill)

    # ── 1. Mahsulot nomi (yuqori, markazda, qalin) ───────────────
    name_y = int(H * 0.04)
    cx(product_name, f_name, name_y, BLACK)

    # ── 2. Kichik sarlavha ───────────────────────────────────────
    sub_y = name_y + int(H * 0.12)
    cx("НОМИ-НАРХИ СУМ", f_small, sub_y, GRAY)

    # ── Separator chiziq ─────────────────────────────────────────
    sep_y = sub_y + int(H * 0.085)
    draw.line([(MARGIN, sep_y), (W - MARGIN, sep_y)], fill=(200, 160, 10), width=2)

    # ── 3. Narx (eng katta, markazda) ───────────────────────────
    price_y = sep_y + int(H * 0.02)
    cx(price, f_price, price_y, BLACK)

    # Narx bbox ni aniqlash
    pb = draw.textbbox((0, 0), price, font=f_price)
    price_bottom = price_y + (pb[3] - pb[1])

    # ── 4. Do'kon nomi (harflar orasida bo'shliq) ────────────────
    shop_y = price_bottom + int(H * 0.025)
    spaced = "  ".join(shop.upper())
    cx(spaced, f_shop, shop_y, DK_GRAY)

    sb = draw.textbbox((0, 0), spaced, font=f_shop)
    shop_bottom = shop_y + (sb[3] - sb[1])

    # ── 5. EAN-13 barkod ─────────────────────────────────────────
    barcode_y = shop_bottom + int(H * 0.035)
    bc_max_w  = int(W * 0.75)

    try:
        fmt_name = "ean13" if len(barcode_number.strip()) == 13 else "code128"
        ean = barcode.get(fmt_name, barcode_number.strip(), writer=ImageWriter())
        buf = io.BytesIO()
        ean.write(buf, options={
            "module_width":   0.38,
            "module_height":  12.0,
            "font_size":      11,
            "text_distance":  4.0,
            "quiet_zone":     3.0,
            "background":     "#{:02X}{:02X}{:02X}".format(*YELLOW),
            "foreground":     "black",
        })
        buf.seek(0)
        bc_img = Image.open(buf).convert("RGB")

        # Proporsional o'lchamga keltirish
        ratio  = bc_max_w / bc_img.width
        bc_img = bc_img.resize(
            (bc_max_w, int(bc_img.height * ratio)),
            Image.LANCZOS,
        )
        paste_x = (W - bc_img.width) // 2
        img.paste(bc_img, (paste_x, barcode_y))
        barcode_bottom = barcode_y + bc_img.height

    except Exception as e:
        # Barkod yaratishda xato bo'lsa — faqat raqamni yozamiz
        print(f"[!] Barkod xatosi: {e}")
        barcode_bottom = barcode_y

    # ── 6. Barkod raqami (formatlanган) ─────────────────────────
    code_y = barcode_bottom + int(H * 0.01)
    f_code = _load_font(int(H * 0.038), bold=False)
    cx(_fmt_ean13(barcode_number), f_code, code_y, BLACK)

    # ── Saqlash ──────────────────────────────────────────────────
    img.save(out_path)
    print(f"✓ Saqlandi: {out_path}  [{W}x{H}px]")
    return out_path


# ── Ko'p nusxa chiqarish ─────────────────────────────────────────
def print_labels(
    product_name: str,
    price: str,
    shop: str,
    barcode_number: str,
    count: int      = 1,
    out_dir: str    = ".",
    prefix: str     = "label",
) -> list[str]:
    """
    Bir xil yorliqning `count` ta nusxasini alohida fayllarga yozadi.
    Qaytaradi: fayl yo'llari ro'yxati.
    """
    os.makedirs(out_dir, exist_ok=True)
    paths = []
    for i in range(1, count + 1):
        fname = os.path.join(out_dir, f"{prefix}_{i:03d}.png")
        make_label(
            product_name=product_name,
            price=price,
            shop=shop,
            barcode_number=barcode_number,
            out_path=fname,
        )
        paths.append(fname)
    return paths


# ── CLI ──────────────────────────────────────────────────────────
def _cli():
    p = argparse.ArgumentParser(description="Narx yorlig'i generatori")
    p.add_argument("--name",    default="FWorld Accent deo 200ml", help="Mahsulot nomi")
    p.add_argument("--price",   default="34 000 UZS",              help="Narx (masalan: '34 000 UZS')")
    p.add_argument("--shop",    default="INBAZAR",                  help="Do'kon nomi")
    p.add_argument("--barcode", default="2000000011936",            help="EAN-13 barkod (13 raqam)")
    p.add_argument("--out",     default="label.png",               help="Saqlash fayli (.png)")
    p.add_argument("--count",   type=int, default=1,               help="Nechta nusxa (label_001.png ...)")
    p.add_argument("--outdir",  default=".",                        help="Papka (--count > 1 uchun)")
    args = p.parse_args()

    if args.count > 1:
        print_labels(args.name, args.price, args.shop, args.barcode,
                     count=args.count, out_dir=args.outdir)
    else:
        make_label(args.name, args.price, args.shop, args.barcode, args.out)


if __name__ == "__main__":
    _cli()
