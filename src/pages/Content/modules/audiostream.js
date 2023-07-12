import secret from '../../../../secrets.development'


const micStream = await navigator.mediaDevices.getUserMedia({audio: true});
const recorder = new MediaRecorder(micStream, {mimeType: 'audio/webm'});

let socket = new WebSocket('wss://api.deepgram.com/v1/listen?model=general-enhanced', ['token', secret.APIKey]);

recorder.addEventListener('dataavailable', evt => {
    if(evt.data.size > 0 && socket.readyState == 1) socket.send(evt.data)
})

socket.onopen = () => { 
    console.log("start recording");
    recorder.start() 
}

socket.onmessage = msg => {
    console.log("recevice msg");
    const { transcript } = JSON.parse(msg.data).channel.alternatives[0]
    if(transcript) {
        console.log(transcript)
        chrome.storage.local.get('transcript', data => {
            chrome.storage.local.set({ transcript: data.transcript += ' ' + transcript })

            // Throws error when popup is closed, so this swallows the errors.
            chrome.runtime.sendMessage({ message: 'transcriptavailable' }).catch(err => ({}))
        })
    }
}

chrome.runtime.onMessage.addListener(({ message }) => {
    if(message == 'stop') {
        socket.close()
        alert('Transcription ended')
    }
})