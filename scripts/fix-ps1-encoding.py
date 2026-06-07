"""
Add UTF-8 BOM to all .ps1 files so PowerShell 5.x reads them as UTF-8.
Run once after any script edit that introduced non-ASCII characters.
"""
import os, glob

scripts_dir = os.path.join(os.path.dirname(__file__))
BOM = b'\xef\xbb\xbf'

fixed = 0
for path in glob.glob(os.path.join(scripts_dir, '*.ps1')):
    data = open(path, 'rb').read()
    if data.startswith(BOM):
        continue
    open(path, 'wb').write(BOM + data)
    print(f'BOM added: {os.path.basename(path)}')
    fixed += 1

print(f'\nDone. {fixed} file(s) updated.')
