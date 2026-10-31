for p in ['js/app.js', 'public/js/app.js']:
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace("iframe.src = '/game.html'", "iframe.src = 'game.html'")
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
print('Fixed iframe.src in app.js')
