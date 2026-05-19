import sys

files = sys.argv[1:]
for f in files:
    with open(f, 'rb') as fh:
        raw = fh.read()
    # The file bytes are UTF-8 of latin-1-decoded UTF-8 (double encoding)
    # Step 1: decode as utf-8 to get the mojibake string
    text = raw.decode('utf-8')
    # Step 2: encode as latin-1 to get the original bytes back
    original_bytes = text.encode('latin-1', errors='replace')
    # Step 3: decode original bytes as utf-8
    fixed = original_bytes.decode('utf-8', errors='replace')
    with open(f, 'w', encoding='utf-8', newline='') as fh:
        fh.write(fixed)
    print(f'Fixed: {f}')
