"""Trim whitespace and white/transparent padding from PNG logo."""
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Install Pillow: pip install Pillow")
    sys.exit(1)

def trim_image(path: str) -> None:
    img = Image.open(path).convert("RGBA")
    data = img.load()
    w, h = img.size

    # Find bounding box of non-empty pixels (not transparent and not solid white)
    def is_empty(pixel):
        r, g, b, a = pixel
        if a < 10:  # transparent
            return True
        if r > 250 and g > 250 and b > 250:  # white/near-white
            return True
        return False

    x_min, y_min = w, h
    x_max, y_max = 0, 0

    for y in range(h):
        for x in range(w):
            if not is_empty(data[x, y]):
                x_min = min(x_min, x)
                y_min = min(y_min, y)
                x_max = max(x_max, x)
                y_max = max(y_max, y)

    if x_max < x_min or y_max < y_min:
        print("No content found")
        return

    # Add small padding (4px) so logo doesn't touch edges
    pad = 4
    x_min = max(0, x_min - pad)
    y_min = max(0, y_min - pad)
    x_max = min(w, x_max + pad + 1)
    y_max = min(h, y_max + pad + 1)

    cropped = img.crop((x_min, y_min, x_max, y_max))
    cropped.save(path)
    print(f"Trimmed: {path} -> {cropped.size[0]}x{cropped.size[1]}")

if __name__ == "__main__":
    root = Path(__file__).resolve().parent.parent
    logo = root / "assets" / "studyspot-logo.png"
    if not logo.exists():
        print(f"Logo not found: {logo}")
        sys.exit(1)
    trim_image(str(logo))
