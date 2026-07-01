from PIL import Image

img = Image.open('uploads/footer_logo_transparent.png')
print("Size:", img.size)
print("Mode:", img.mode)

# Count how many transparent vs non-transparent pixels we have
pixels = list(img.getdata())
total = len(pixels)
transparent = sum(1 for p in pixels if p[3] == 0)
opaque = total - transparent

print(f"Total pixels: {total}")
print(f"Transparent pixels: {transparent} ({transparent/total*100:.2f}%)")
print(f"Opaque pixels: {opaque} ({opaque/total*100:.2f}%)")

# Let's print some non-transparent pixels that might be background
corners = [pixels[0], pixels[1], pixels[img.size[0]], pixels[-1]]
print("Sample pixels (corners/edges):", corners)
