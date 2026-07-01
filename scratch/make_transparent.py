from PIL import Image

# Open the original image
img = Image.open('uploads/1782382653047-c5809bca1d81a9ba.jpg').convert('RGBA')
datas = img.getdata()

new_data = []
target_color = (32, 32, 32)
threshold = 25  # tolerance for JPEG artifacts

for item in datas:
    r, g, b, a = item
    # Calculate Euclidean distance in RGB space
    dist = ((r - target_color[0])**2 + (g - target_color[1])**2 + (b - target_color[2])**2)**0.5
    if dist < threshold:
        # Make transparent
        new_data.append((0, 0, 0, 0))
    else:
        new_data.append(item)

img.putdata(new_data)
img.save('uploads/footer_logo_transparent.png', 'PNG')
print("Processed image and saved as uploads/footer_logo_transparent.png")
