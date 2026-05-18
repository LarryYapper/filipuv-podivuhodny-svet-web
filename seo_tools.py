import os
import re
from datetime import datetime

ROOT = os.path.abspath(os.path.dirname(__file__))
EXCLUDE_DIRS = {"assets", "emails"}
DOMAIN_PLACEHOLDER = "https://filipuvpodivuhodnysvet.cz"

def list_html_files():
    files = []
    for entry in os.listdir(ROOT):
        path = os.path.join(ROOT, entry)
        if os.path.isfile(path) and entry.lower().endswith('.html'):
            files.append(path)
    return files

def ensure_head_tags(html, filename):
    head_re = re.compile(r"(</head>)", re.I)
    parts = head_re.split(html, maxsplit=1)
    if len(parts) < 3:
        return html, []
    before_head = parts[0]
    closing = parts[1]
    after = parts[2]
    changes = []
    head_content = before_head

    def has(pattern):
        return re.search(pattern, head_content, re.I | re.S) is not None

    # viewport
    if not has(r'<meta\s+name=["\']viewport'):
        insertion = '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
        head_content += insertion
        changes.append('viewport')

    # meta description
    if not has(r'<meta\s+name=["\']description'):
        title_match = re.search(r'<title>(.*?)</title>', head_content, re.I | re.S)
        desc = (title_match.group(1).strip() if title_match else "Stručný popis stránky.")
        insertion = f'<meta name="description" content="{desc}">\n'
        head_content += insertion
        changes.append('description')

    # canonical
    if not has(r'<link\s+rel=["\']canonical'):
        relpath = os.path.basename(filename)
        href = DOMAIN_PLACEHOLDER.rstrip('/') + '/' + relpath
        insertion = f'<link rel="canonical" href="{href}">\n'
        head_content += insertion
        changes.append('canonical')

    # Open Graph & Twitter
    if not has(r'property=["\']og:title'):
        # grab title/description if available
        title_match = re.search(r'<title>(.*?)</title>', head_content, re.I | re.S)
        desc_match = re.search(r'<meta\s+name=["\']description\'\s+content=["\'](.*?)["\']', head_content, re.I | re.S)
        title = title_match.group(1).strip() if title_match else os.path.basename(filename)
        desc = desc_match.group(1).strip() if desc_match else title
        url = DOMAIN_PLACEHOLDER.rstrip('/') + '/' + os.path.basename(filename)
        og = []
        og.append(f'<meta property="og:title" content="{title}">')
        og.append(f'<meta property="og:description" content="{desc}">')
        og.append(f'<meta property="og:url" content="{url}">')
        og.append('<meta property="og:type" content="website">')
        og.append('<meta name="twitter:card" content="summary_large_image">')
        head_content += '\n'.join(og) + '\n'
        changes.append('og/twitter')

    new_html = head_content + closing + after
    return new_html, changes

def add_lazy_loading(html):
    # add loading="lazy" to img tags without it
    def repl(m):
        tag = m.group(0)
        if re.search(r'loading=', tag, re.I):
            return tag
        # insert before closing >
        return tag[:-1] + ' loading="lazy">'
    new_html, n = re.subn(r'<img\s+[^>]*?>', repl, html, flags=re.I)
    return new_html, n

def minify_css(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            s = f.read()
        # remove /* */ comments
        s = re.sub(r'/\*.*?\*/', '', s, flags=re.S)
        # collapse whitespace
        s = re.sub(r'\s+', ' ', s)
        s = re.sub(r'\s*([{};:,])\s*', r'\1', s)
        s = s.strip()
        with open(path, 'w', encoding='utf-8') as f:
            f.write(s)
        return True
    except Exception as e:
        print('CSS minify failed:', e)
        return False

def generate_sitemap(html_files, out='sitemap.xml'):
    urls = []
    for f in html_files:
        name = os.path.basename(f)
        loc = DOMAIN_PLACEHOLDER.rstrip('/') + '/' + name
        mtime = datetime.utcfromtimestamp(os.path.getmtime(f)).strftime('%Y-%m-%d')
        urls.append((loc, mtime))
    parts = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, lastmod in urls:
        parts.append('  <url>')
        parts.append(f'    <loc>{loc}</loc>')
        parts.append(f'    <lastmod>{lastmod}</lastmod>')
        parts.append('  </url>')
    parts.append('</urlset>')
    with open(os.path.join(ROOT, out), 'w', encoding='utf-8') as f:
        f.write('\n'.join(parts))
    return out

def write_robots(out='robots.txt'):
    txt = "User-agent: *\nDisallow:\nSitemap: " + DOMAIN_PLACEHOLDER.rstrip('/') + '/sitemap.xml\n'
    with open(os.path.join(ROOT, out), 'w', encoding='utf-8') as f:
        f.write(txt)
    return out

def inject_jsonld(index_path):
    # Uses provided organization/site info for JSON-LD injection
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": DOMAIN_PLACEHOLDER + "#website",
                "url": DOMAIN_PLACEHOLDER,
                "name": "Filipův podivuhodný svět",
                "publisher": {"@id": DOMAIN_PLACEHOLDER + "#organization"},
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": DOMAIN_PLACEHOLDER + "/?s={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "Organization",
                "@id": DOMAIN_PLACEHOLDER + "#organization",
                "name": "Filipův podivuhodný svět",
                "legalName": "Bc. Filip Kubík",
                "url": DOMAIN_PLACEHOLDER,
                "logo": "https://filipuvpodivuhodnysvet.cz/assets/Filip%C5%AFv%20podivuhodn%C3%BD%20sv%C4%9Bt_logo%202.0.png",
                "contactPoint": [{"@type": "ContactPoint", "email": "filip@filipuvpodivuhodnysvet.cz", "contactType": "customer service"}]
            }
        ]
    }
    import json
    jsonld = json.dumps(data, ensure_ascii=False)
    # read index
    with open(index_path, 'r', encoding='utf-8') as f:
        html = f.read()
    # replace example.com occurrences in index as well
    html = html.replace('https://example.com', DOMAIN_PLACEHOLDER)
    # insert JSON-LD before </head>
    if '</head>' in html:
        html = html.replace('</head>', f'<script type="application/ld+json">{jsonld}</script>\n</head>')
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print('Injected JSON-LD into index.html')
    else:
        print('index.html has no </head> tag; JSON-LD not injected')

def main():
    html_files = list_html_files()
    report = []
    modified = 0
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as fh:
            html = fh.read()
        # replace any previously-inserted example.com with actual domain
        html = html.replace('https://example.com', DOMAIN_PLACEHOLDER)
        html = html.replace('http://example.com', DOMAIN_PLACEHOLDER)

        new_html, changes = ensure_head_tags(html, f)
        new_html2, imgs_changed = add_lazy_loading(new_html)
        if changes or imgs_changed:
            with open(f, 'w', encoding='utf-8') as fh:
                fh.write(new_html2)
            modified += 1
            report.append((os.path.basename(f), changes, imgs_changed))

    css_path = os.path.join(ROOT, 'styles.css')
    css_ok = False
    if os.path.exists(css_path):
        css_ok = minify_css(css_path)

    sitemap = generate_sitemap(html_files)
    robots = write_robots()

    # inject site-level JSON-LD into index.html
    try:
        inject_jsonld(os.path.join(ROOT, 'index.html'))
    except Exception as e:
        print('JSON-LD injection failed:', e)

    print('Processed HTML files:', len(html_files))
    print('Modified files:', modified)
    for r in report:
        name, ch, imgs = r
        print('-', name, 'changes:', ch, 'imgs_changed:', imgs)
    print('styles.css minified:', css_ok)
    print('sitemap written to', sitemap)
    print('robots written to', robots)

if __name__ == '__main__':
    main()
