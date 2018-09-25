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
    link.setAttribute('href', 'https://fairshake.cloud/assessment/add?target__title=' + encodeURIComponent(title) +'&target__url=' + encodeURIComponent(url))
    link.style.display = 'block'
})

