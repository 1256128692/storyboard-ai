import requests

for id_, fname in [(1, 'panda_ref.png'), (2, 'polar_bear_ref.png')]:
    path = r'C:\Users\Administrator\storyboard-ai\backend\src\main\resources\static\images' + '\\' + fname
    with open(path, 'rb') as f:
        files = {'file': (fname, f, 'image/png')}
        r = requests.post(f'http://localhost:8080/api/characters/{id_}/image', files=files)
        print(f'Char {id_}:', r.status_code, r.json().get('referenceImageUrl'))
