import re
import os

def camel_to_kebab(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1-\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1-\2', s1).lower()

def convert_react_to_html(input_file, output_html):
    with open(input_file, 'r', encoding='utf-8') as f:
        jsx = f.read()

    # 1. GUARANTEED EXTRACTION: Find the exact start and end of the HTML code
    return_idx = jsx.find('return')
    if return_idx != -1:
        start_idx = jsx.find('<', return_idx) # First bracket after return
        end_idx = jsx.rfind('>')              # Last bracket in the file
        if start_idx != -1 and end_idx != -1:
            html_content = jsx[start_idx:end_idx+1]
        else:
            html_content = jsx
    else:
        html_content = jsx

    # 2. Fix React text artifacts (like {' '} and {" "})
    html_content = html_content.replace("{' '}", " ")
    html_content = html_content.replace('{" "}', ' ')
    html_content = html_content.replace('{"\\n"}', '\n')
    
    # 3. Remove React fragments
    html_content = html_content.replace("<>", "")
    html_content = html_content.replace("</>", "")

    # 4. Convert React attributes to HTML attributes
    html_content = html_content.replace('className=', 'class=')
    html_content = html_content.replace('htmlFor=', 'for=')

    # 5. Safely convert Inline Styles to standard CSS strings
    # e.g., style={{ color: "red" }} -> style="color: red;"
    def style_replacer(match):
        style_obj = match.group(1)
        pairs = re.findall(r'([a-zA-Z0-9_]+)\s*:\s*(["\'][^"\']*["\']|[-0-9.]+)', style_obj)
        css_str =[]
        for key, val in pairs:
            css_key = camel_to_kebab(key)
            css_val = val.strip('\'"')
            # Automatically add 'px' to numbers
            if css_val.replace('.', '', 1).replace('-', '', 1).isdigit() and css_key not in['opacity', 'font-weight', 'z-index', 'flex', 'line-height']:
                css_val += 'px'
            css_str.append(f"{css_key}: {css_val}")
        return f'style="{"; ".join(css_str)}"' if css_str else ''

    html_content = re.sub(r'style=\{\{(.*?)\}\}', style_replacer, html_content, flags=re.DOTALL)

    # 6. CRITICAL LAYOUT FIX: Convert <div /> to <div></div>
    # HTML5 only allows specific tags (like img, br, input) to self-close!
    void_elements = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse'}
    
    def fix_self_closing(match):
        tag_name = match.group(1)
        attributes = match.group(2)
        if tag_name.lower() in void_elements:
            return f"<{tag_name}{attributes}>"
        else:
            return f"<{tag_name}{attributes}></{tag_name}>"

    html_content = re.sub(r'<([a-zA-Z0-9]+)([^>]*?)/\s*>', fix_self_closing, html_content)

    # 7. Fix SVG attributes
    svg_attrs =["strokeWidth", "strokeLinecap", "strokeLinejoin", "fillRule", "clipRule", "strokeDasharray", "strokeDashoffset"]
    for attr in svg_attrs:
        html_content = html_content.replace(f'{attr}=', f'{camel_to_kebab(attr)}=')
    html_content = html_content.replace('view-box=', 'viewBox=')

    # 8. Wrap everything in a standard HTML file
    final_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Filipův podivuhodný svět</title>
    
    <!-- Load Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
        
        body {{
            background-color: #F7F5EF; 
            font-family: 'Inter', sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }}
    </style>
</head>
<body>
{html_content}
</body>
</html>"""

    # Save to index.html
    with open(output_html, 'w', encoding='utf-8') as f:
        f.write(final_html)

    print(f"✅ Success! Your layout has been extracted properly.")

if __name__ == "__main__":
    if os.path.exists("paper-export.jsx"):
        convert_react_to_html("paper-export.jsx", "index.html")
    else:
        print("❌ Error: 'paper-export.jsx' not found. Please make sure the file is named correctly.")