// api do youtube
var tag = document.createElement('script')

tag.src = "https://www.youtube.com/iframe_api"
var firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

let video
let ambientLight
let animationHasEnded = false
const videoId = 'qC0vDKVPCrw'

function createAmbientLight() {
    if(!animationHasEnded) return

    ambientLight = new YT.Player('ambient-light', {
        videoId,
        events: {
            onReady: ambientLightReady,
            onStateChange: ambientStateChange,
        }
    })
}

window.onYouTubeIframeAPIReady = function() {
    video = new YT.Player('video', {
        videoId,
        events: {
            onStateChange: videoStateChange,
        }
    })
}

// funções para controlar o estado dos vídeos
function videoStateChange(event) {
    switch(event.data) {
        case YT.PlayerState.PLAYING:
            if(!ambientLight) return
            // responsável por setar no player do vídeo ambiente o mesmo time do vídeo original "passado por parâmetro"
            ambientLight.seekTo(event.target.getCurrentTime())
            // responsável por dar play no vídeo de ambiente junto com o original
            ambientLight.playVideo()
            break

        case YT.PlayerState.PAUSED:
            if(!ambientLight) return
            // responsável por setar no player do vídeo ambiente o mesmo time do vídeo original "passado por parâmetro"
            ambientLight.seekTo(event.target.getCurrentTime())
            // responsável por dar pause no vídeo de ambiente junto com o original
            ambientLight.pauseVideo()
    }
}

function betterAmbientLight(event) {
    event.target.mute()

    const qualityLevels = event.target.getAvailableQualityLevels()
    if(qualityLevels && qualityLevels.length && qualityLevels.length > 0) {
        qualityLevels.reverse()
        const lowestLevel = 
        // pega a qualidade de vídeo menor sem ser a automática
        qualityLevels[qualityLevels.findIndex(q => q !== 'auto')]

        event.target.setPlayBackQuality(lowestLevel)
    }
}

function ambientLightReady(event) {
    betterAmbientLight(event)
}

function ambientStateChange(event) {
    switch(event.data) {
        case YT.PlayerState.BUFFER:
        case YT.PlayerState.PLAYING:
            betterAmbientLight(event)
        break
    }
}

const app = document.querySelector('#app')
app.addEventListener('animationend', e => {
    if(e.animationName !== 'appear') return

    animationHasEnded = true
    createAmbientLight()
})