import os
src = r'E:\ZALO MINI APP\TRƯỜNG NSG\NSG NEWS\src'
total = 0
bad = []
if not os.path.exists(src):
    print(f"Directory not found: {src}")
    exit(1)
for root, dirs, files in os.walk(src):
    for fn in files:
        if fn.endswith(('.ts','.tsx','.js','.jsx')):
            fp = os.path.join(root, fn)
            try:
                d = open(fp, 'rb').read()
                reps = d.decode('utf-8', 'replace').count(chr(0xfffd))
                if reps > 0:
                    rel = fp.replace(src, '')
                    bad.append((reps, rel))
                    total += reps
            except Exception as e:
                print(f"Error reading {fp}: {e}")

if total == 0:
    print('ALL CLEAN - 0 replacement chars in entire src/')
else:
    print(f'Total remaining: {total}')
    for reps, rel in sorted(bad, reverse=True):
        print(f'{reps}: {rel}')
