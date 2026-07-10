from PIL import Image
import random

# Load logos
img1 = Image.open('public/logo1.png').convert("RGBA") # Base / True Logo
img0 = Image.open('public/logo0.png').convert("RGBA") # Glitch

# Crop to bounding boxes to remove asymmetrical transparent margins
bbox1 = img1.getbbox()
bbox0 = img0.getbbox()

img1_cropped = img1.crop(bbox1)
img0_cropped = img0.crop(bbox0)

# Resize glitch to match the cropped base perfectly
img0_resized = img0_cropped.resize(img1_cropped.size, Image.Resampling.LANCZOS)

frames = []
durations = []

random.seed(42)

total_time = 0
showing_logo1 = True

while total_time < 10000:
    interval = int(random.random() * 500)
    interval = max(10, interval)
    
    if showing_logo1:
        frames.append(img1_cropped)
    else:
        frames.append(img0_resized)
        
    durations.append(interval)
    total_time += interval
    showing_logo1 = not showing_logo1

# Save
frames[0].save('public/logo-glitch.webp', save_all=True, append_images=frames[1:], duration=durations, loop=0, lossless=True)
print("WebP created successfully")
