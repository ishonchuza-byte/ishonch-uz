from PIL import Image

img = Image.open('uploads/1782382653047-c5809bca1d81a9ba.jpg')
print("Format:", img.format)
print("Size:", img.size)
print("Mode:", img.mode)

# Let's inspect some pixel values at the corner
corner_pixels = [img.getpixel((x, y)) for x in range(5) for y in range(5)]
print("Corner pixels:", corner_pixels)
