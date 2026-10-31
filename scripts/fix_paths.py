for path in ['index.html', 'public/index.html']:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Replace absolute paths with relative paths
    html = html.replace('href="/css/style.css"', 'href="css/style.css"')
    html = html.replace('src="/assets/hero-rover.jpg"', 'src="assets/hero-rover.jpg"')
    html = html.replace('href="/game.html"', 'href="game.html"')
    html = html.replace('src="/game.html"', 'src="game.html"')
    html = html.replace('src="/js/mars_sim.js"', 'src="js/mars_sim.js"')
    html = html.replace('src="/js/museum_3d.js"', 'src="js/museum_3d.js"')
    html = html.replace('src="/js/evidence_graph.js"', 'src="js/evidence_graph.js"')
    html = html.replace('src="/js/app.js"', 'src="js/app.js"')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)

print("Updated paths to relative in index.html and public/index.html")
