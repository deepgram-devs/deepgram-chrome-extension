import secret from "../../../../secrets.development"
alert('audio script runs');


navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
.then(stream => {
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    const socket = new WebSocket('wss://api.deepgram.com/v1/listen?model=general-enhanced', ['token', secret.APIKey]);
    recorder.addEventListener('dataavailable', evt => {
        if(evt.data.size > 0 && socket.readyState == 1) socket.send(evt.data)
    });

    socket.onopen = () => { recorder.start(250) }

    socket.onmessage = msg => {
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
});