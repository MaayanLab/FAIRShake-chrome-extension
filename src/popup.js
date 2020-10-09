const insignia = require('fairshakeinsignia')

chrome.tabs.query({
    active: true,
    currentWindow: true
}, (tabs) => {
    const { url, title } = tabs[0]

    const info = document.getElementById('fairshakeBkletInfo')
    info.style.display = 'block'

    const insigniaContainer = document.getElementById('fairness-bklet-insig')
    insignia.build_svg_from_score(insigniaContainer, { url })

    const link = document.getElementById('fairshakeBkletLink')
    link.setAttribute('href', 'https://fairshake.cloud/?q=' + encodeURIComponent(url) +'&projects=1&digitalobjects=1&rubrics=1&metrics=1')
    link.style.display = 'block'
})

