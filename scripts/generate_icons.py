import os
from PIL import Image, ImageDraw, ImageFilter

MASTER_PATH = '/Users/wanghaoqiang/.gemini/antigravity/brain/6f298306-5e2e-42ad-ac0a-76edbe1db8ad/onco_app_icon_1791023213085.jpg'
BASE_DIR = '/Users/wanghaoqiang/Developer/OncoCalculate'

def make_circle_mask(size):
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    return mask

def make_rounded_mask(size, radius):
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size, size), radius=radius, fill=255)
    return mask

def generate_icons():
    master = Image.open(MASTER_PATH).convert('RGBA')
    w, h = master.size

    # 1. Output Web / Public icons
    os.makedirs(os.path.join(BASE_DIR, 'public'), exist_ok=True)
    master.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(BASE_DIR, 'public/icon.png'), 'PNG')
    master.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(BASE_DIR, 'public/icon-192.png'), 'PNG')
    master.resize((64, 64), Image.Resampling.LANCZOS).save(os.path.join(BASE_DIR, 'public/favicon.png'), 'PNG')
    print("Web icons generated in public/")

    # Also save to src/assets for in-app display
    os.makedirs(os.path.join(BASE_DIR, 'src/assets'), exist_ok=True)
    master.resize((256, 256), Image.Resampling.LANCZOS).save(os.path.join(BASE_DIR, 'src/assets/logo.png'), 'PNG')

    # 2. Android Mipmap dimensions
    mipmap_configs = {
        'mdpi': {'launcher': 48, 'foreground': 108},
        'hdpi': {'launcher': 72, 'foreground': 162},
        'xhdpi': {'launcher': 96, 'foreground': 216},
        'xxhdpi': {'launcher': 144, 'foreground': 324},
        'xxxhdpi': {'launcher': 192, 'foreground': 432},
    }

    res_dir = os.path.join(BASE_DIR, 'android/app/src/main/res')

    for density, sizes in mipmap_configs.items():
        folder = os.path.join(res_dir, f'mipmap-{density}')
        os.makedirs(folder, exist_ok=True)

        l_size = sizes['launcher']
        f_size = sizes['foreground']

        # ic_launcher.png (Rounded squircle / full bleed)
        launcher_img = master.resize((l_size, l_size), Image.Resampling.LANCZOS)
        launcher_img.save(os.path.join(folder, 'ic_launcher.png'), 'PNG')

        # ic_launcher_round.png (Circular mask)
        circle_mask = make_circle_mask(l_size)
        round_img = Image.new('RGBA', (l_size, l_size), (0, 0, 0, 0))
        round_img.paste(launcher_img, (0, 0), circle_mask)
        round_img.save(os.path.join(folder, 'ic_launcher_round.png'), 'PNG')

        # ic_launcher_foreground.png (Adaptive icon foreground)
        # In Android adaptive icons, the safe central zone is 66/108 of the canvas.
        # We place our master icon scaled into the safe area of the canvas.
        fg_canvas = Image.new('RGBA', (f_size, f_size), (0, 0, 0, 0))
        icon_safe_size = int(f_size * 0.72)
        offset = (f_size - icon_safe_size) // 2
        safe_icon = master.resize((icon_safe_size, icon_safe_size), Image.Resampling.LANCZOS)
        fg_canvas.paste(safe_icon, (offset, offset), safe_icon)
        fg_canvas.save(os.path.join(folder, 'ic_launcher_foreground.png'), 'PNG')
        print(f"Mipmap {density} icons saved.")

    # 3. Android Splash Screens
    splash_configs = [
        ('drawable/splash.png', 480, 320),
        ('drawable-land-mdpi/splash.png', 480, 320),
        ('drawable-land-hdpi/splash.png', 800, 480),
        ('drawable-land-xhdpi/splash.png', 1280, 720),
        ('drawable-land-xxhdpi/splash.png', 1600, 960),
        ('drawable-land-xxxhdpi/splash.png', 1920, 1280),
        ('drawable-port-mdpi/splash.png', 320, 480),
        ('drawable-port-hdpi/splash.png', 480, 800),
        ('drawable-port-xhdpi/splash.png', 720, 1280),
        ('drawable-port-xxhdpi/splash.png', 960, 1600),
        ('drawable-port-xxxhdpi/splash.png', 1280, 1920),
    ]

    bg_color = (9, 14, 26, 255) # Deep clinical dark navy

    for rel_path, sw, sh in splash_configs:
        out_path = os.path.join(res_dir, rel_path)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)

        splash_img = Image.new('RGBA', (sw, sh), bg_color)
        
        # Center logo emblem on splash
        min_dim = min(sw, sh)
        logo_size = int(min_dim * 0.42)
        logo_resized = master.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

        pos_x = (sw - logo_size) // 2
        pos_y = (sh - logo_size) // 2

        splash_img.paste(logo_resized, (pos_x, pos_y), logo_resized)
        splash_img.save(out_path, 'PNG')

    print("All splash screens successfully generated.")

if __name__ == '__main__':
    generate_icons()
