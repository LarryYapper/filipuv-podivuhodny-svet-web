import os

def process():
    with open('postovni-klub.html', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    for i in range(len(lines)):
        if 'padding-inline: clamp(20px, 5vw, 80px)' in lines[i]:
            # Exception: Navigation
            if i > 0 and 'nav-load' in lines[i-1]:
                if 'max-width' not in lines[i]:
                    lines[i] = lines[i].replace('">', ' max-width: 1280px; margin: 0 auto;">')
                continue
                
            # Normal sections: inner div starts at i+1
            if i+1 < len(lines) and '<div' in lines[i+1]:
                if i+2 < len(lines) and 'style="' in lines[i+2] and 'max-width: 1280px' not in lines[i+2]:
                    # Exception for sticky tier bar and Comparison table header
                    if 'Sticky Select' in lines[i-1] or 'Sticky Select' in lines[i-2] or 'Sticky Select' in lines[i-3]:
                        pass
                    else:
                        lines[i+2] = lines[i+2].replace('style="', 'style="width: 100%; max-width: 1280px; margin: 0 auto; ')

    with open('postovni-klub.html', 'w', encoding='utf-8') as f:
        f.writelines(lines)

process()
