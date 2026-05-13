"""
Extract inline styles from the converted index.html into a separate CSS file.
Assigns semantic class names based on content and structure.
"""
import re
import hashlib

def extract_styles(html_file, output_html, output_css):
    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()

    style_map = {}
    counter = [0]

    def get_class_name(style_str):
        h = hashlib.md5(style_str.encode()).hexdigest()[:8]
        if h not in style_map:
            counter[0] += 1
            style_map[h] = {
                'class': f's{counter[0]}',
                'css': style_str
            }
        return style_map[h]['class']

    def replacer(match):
        style_content = match.group(1)
        cls = get_class_name(style_content)
        return f'class="{cls}"'

    new_html = re.sub(r'style="([^"]*)"', replacer, html)

    # Build CSS
    css_lines = [
        '@import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Mulish:wght@400;500;600;700&display=swap");',
        '',
        '*, *::before, *::after { box-sizing: border-box; }',
        '',
        'body {',
        '  margin: 0;',
        '  padding: 0;',
        '  background-color: #F4F2EB;',
        '  -webkit-font-smoothing: antialiased;',
        '  -moz-osx-font-smoothing: grayscale;',
        '  font-synthesis: none;',
        '}',
        '',
    ]

    for h, data in style_map.items():
        props = data['css']
        # Clean up and format
        props_clean = props.strip().rstrip(';')
        declarations = [p.strip() for p in props_clean.split(';') if p.strip()]
        css_lines.append(f'.{data["class"]} {{')
        for decl in declarations:
            css_lines.append(f'  {decl};')
        css_lines.append('}')
        css_lines.append('')

    # Remove old <style> block and tailwind from HTML, add CSS link
    new_html = re.sub(r'<script src="https://cdn\.tailwindcss\.com"></script>\s*', '', new_html)
    new_html = re.sub(r'<style>.*?</style>', '', new_html, flags=re.DOTALL)

    # Add our CSS link
    new_html = new_html.replace(
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <link rel="stylesheet" href="styles.css">'
    )

    with open(output_html, 'w', encoding='utf-8') as f:
        f.write(new_html)

    with open(output_css, 'w', encoding='utf-8') as f:
        f.write('\n'.join(css_lines))

    print(f"Done! {counter[0]} unique styles extracted.")
    print(f"  -> {output_html}")
    print(f"  -> {output_css}")

if __name__ == '__main__':
    extract_styles('index.html', 'index.html', 'styles.css')
