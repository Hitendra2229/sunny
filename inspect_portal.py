import re

with open('static/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for idx, line in enumerate(lines):
    if '<section' in line or '<header' in line or '<footer' in line or 'class="modal' in line:
        print(f"Line {idx+1}: {line.strip()[:100]}")
