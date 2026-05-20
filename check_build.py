import os
www = r'E:\ZALO MINI APP\TRƯỜNG NSG\NSG NEWS\www'
for root, dirs, files in os.walk(www):
    for fn in files:
        fp = os.path.join(root, fn)
        rel = fp.replace(www,'')
        d = open(fp, 'rb').read()
        if fn.endswith(('.js', '.html')):
            try:
                content = d.decode('utf-8')
                reps = content.count('\ufffd')
            except:
                reps = d.decode('utf-8', 'replace').count('\ufffd')
            status = f'CORRUPTED {reps}x' if reps > 0 else 'OK'
            print(f'{status}: {rel} ({len(d)} bytes)')
