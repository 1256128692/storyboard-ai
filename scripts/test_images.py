import requests

chars = requests.get('http://localhost:8080/api/characters').json()
print('Characters:', len(chars))
for c in chars:
    img_url = c.get('referenceImageUrl')
    print('  Name:', c['name'], '| img:', img_url)
    if img_url:
        r = requests.get('http://localhost:8080' + img_url)
        print('    img:', r.status_code, len(r.content), 'bytes')
