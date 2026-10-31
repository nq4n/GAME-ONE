import os, shutil

# Copy public/index.html to root index.html
shutil.copy2('public/index.html', 'index.html')

# Copy public/game.html to root game.html
shutil.copy2('public/game.html', 'game.html')

# Copy assets, css, js to root if not already present
for folder in ['css', 'js', 'assets']:
    src = os.path.join('public', folder)
    dst = os.path.join('.', folder)
    if os.path.exists(src):
        os.makedirs(dst, exist_ok=True)
        for item in os.listdir(src):
            s_item = os.path.join(src, item)
            d_item = os.path.join(dst, item)
            if os.path.isfile(s_item):
                shutil.copy2(s_item, d_item)

print("Synchronized all assets, css, js, index.html, game.html into root folder!")
