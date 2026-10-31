import os

with open('echoes_space_v2/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Enhance save() to broadcast progress to parent window if in an iframe
search_str = "function save(){try{localStorage.setItem(saveKey,JSON.stringify({v:2,lang,found,completed,labDone,route,scene:scene==='moon'?'moon':'hub',phase,player,driveProgress,roverHealth,sim}))}catch(e){}}"
replace_str = "function save(){try{localStorage.setItem(saveKey,JSON.stringify({v:2,lang,found,completed,labDone,route,scene:scene==='moon'?'moon':'hub',phase,player,driveProgress,roverHealth,sim}));if(window.parent&&window.parent!==window){window.parent.postMessage({type:'ECHOES_GAME_SYNC',found,completed,labDone,phase},'*');}}catch(e){}}"

if search_str in content:
    patched = content.replace(search_str, replace_str)
    with open('public/game.html', 'w', encoding='utf-8') as f:
        f.write(patched)
    with open('public/game/index.html', 'w', encoding='utf-8') as f:
        f.write(patched)
    print("Successfully patched public/game.html and public/game/index.html with postMessage bridge!")
else:
    print("Could not find exact save() string, writing direct copy")
    with open('public/game.html', 'w', encoding='utf-8') as f:
        f.write(content)
    with open('public/game/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
