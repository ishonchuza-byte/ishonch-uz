from PIL import Image
from collections import Counter

img = Image.open('uploads/1782382653047-c5809bca1d81a9ba.jpg')
pixels = list(img.getdata())

# Find the most common colors
counter = Counter(pixels)
print("15 Most common colors in the image:")
for color, count in counter.most_common(15):
    print(f"Color: {color}, Count: {count} ({count/len(pixels)*100:.2f}%)")
