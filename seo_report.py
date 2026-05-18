import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def list_html_files():
    return [p for p in ROOT.iterdir() if p.suffix.lower()=='.html']

def analyze_html(path):
    s = path.read_text(encoding='utf-8')
    h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', s, re.I | re.S)
    imgs = re.findall(r'<img\s+([^>]*?)>', s, re.I | re.S)
    img_info = []
    for attrs in imgs:
        src_m = re.search(r'src=["\'](.*?)["\']', attrs)
        alt_m = re.search(r'alt=["\'](.*?)["\']', attrs)
        src = src_m.group(1) if src_m else ''
        alt = alt_m.group(1) if alt_m else None
        img_info.append((src, alt))
    return h1s, img_info

def file_size(path):
    try:
        return path.stat().st_size
    except Exception:
        return None

def main():
    html_files = list_html_files()
    missing_h1 = []
    multiple_h1 = []
    imgs_missing_alt = []
    imgs_empty_alt = []
    referenced_images = set()

    for p in html_files:
        h1s, img_info = analyze_html(p)
        if len(h1s) == 0:
            missing_h1.append(str(p.name))
        if len(h1s) > 1:
            multiple_h1.append((p.name, len(h1s)))
        for src, alt in img_info:
            if not src:
                continue
            referenced_images.add(src)
            if alt is None:
                imgs_missing_alt.append((p.name, src))
            elif alt.strip() == '':
                imgs_empty_alt.append((p.name, src))

    # inspect assets folder for image files and sizes
    assets = list((ROOT / 'assets').glob('**/*')) if (ROOT / 'assets').exists() else []
    large_images = []
    for a in assets:
        if a.is_file() and a.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']:
            sz = file_size(a)
            if sz and sz > 200*1024:
                large_images.append((str(a.relative_to(ROOT)), sz))

    # also check referenced images that might be outside assets
    missing_files = []
    for r in referenced_images:
        if r.startswith('http'):
            continue
        rp = (ROOT / r).resolve()
        if not rp.exists():
            missing_files.append(r)

    print('H1 report:')
    print(' Pages with NO H1:', len(missing_h1))
    for x in missing_h1:
        print('  -', x)
    print(' Pages with MULTIPLE H1s:', len(multiple_h1))
    for x, n in multiple_h1:
        print('  -', x, '(', n, 'H1s)')

    print('\nImage alt report:')
    print(' Images missing alt attributes:', len(imgs_missing_alt))
    for page, src in imgs_missing_alt:
        print('  -', page, '->', src)
    print(' Images with empty alt attributes:', len(imgs_empty_alt))
    for page, src in imgs_empty_alt:
        print('  -', page, '->', src)

    print('\nReferenced images not found on disk (relative paths):', len(missing_files))
    for r in missing_files:
        print('  -', r)

    print('\nLarge images in assets/ (>200KB):', len(large_images))
    for p, sz in sorted(large_images, key=lambda x: -x[1]):
        print('  -', p, f'({sz//1024} KB)')

if __name__ == '__main__':
    main()
