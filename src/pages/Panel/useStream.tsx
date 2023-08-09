import { useState, useRef } from "react";
import { formatTranscription } from "./utils";

const useStream = () => {
    const [transcript, setTranscript] = useState("");
    const resultRef = useRef([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);

    const handleStream = async (token : string) => {
        const { livestreamOptions } = await chrome.storage.sync.get("livestreamOptions");
        var queryString = "";
        for (const key in livestreamOptions) {
            const value = livestreamOptions[key];
            if (queryString.length > 0) {
                queryString += ("&" + key + "=" + value)
            } else {
                queryString = (key + "=" + value);
            }
        }

        if (isStreaming) {
            setIsStreaming(false);  
            if (socketRef.current) socketRef.current.close();
            if (recorderRef.current) recorderRef.current.stop();
        } else {
            setIsStreaming(true);
            socketRef.current = new WebSocket(`wss://api.deepgram.com/v1/listen?${queryString}`, ['token', token]);
            socketRef.current.addEventListener('error', (err) => {
                setIsStreaming(false);
                if (socketRef.current) socketRef.current.close();
                if (recorderRef.current) recorderRef.current.stop();
                console.error(err);
            });


            let screenStream : MediaStream | null = null;
            let micStream : MediaStream | null = null;
            try {
                screenStream = await navigator.mediaDevices.getDisplayMedia({audio: true});
            } catch (err) {
                if (err.name !== 'NotAllowedError') {
                    console.error(err);
                }
            }
            
            try {
                micStream = await navigator.mediaDevices.getUserMedia({audio: true});
            } catch (err) {
                if (err.name !== 'NotAllowedError') {
                    console.error(err);
                }
            }
                
            const audioContext = new AudioContext();
            const mixed = mix(audioContext, [screenStream, micStream])
            recorderRef.current = new MediaRecorder(mixed, {mimeType: 'audio/webm'});
                
            socketRef.current.addEventListener('message', msg => {
                const data = JSON.parse(msg.data);
                console.log(data);
                if (!data.channel) {
                // Server will send metadata if it closes the connection. 
                // Todo: tell user to restart
                    if (socketRef.current) socketRef.current.close();
                    if (recorderRef.current) recorderRef.current.stop();
                    setIsStreaming(false);
                    return;
                } else if (data.channel) {
                    resultRef.current.concat(data);
                    setTranscript(previous => {
                        return previous + formatTranscription(data, livestreamOptions);
                    });
            }
        });
            
            recorderRef.current.ondataavailable = (evt : any) => {
                if (socketRef.current && evt.data.size > 0 
                    && socketRef.current.readyState == socketRef.current.OPEN) {
                        console.log("data avaiable, sending through wss");
                        socketRef.current.send(evt.data)
                    }
                }
          
            socketRef.current.addEventListener('close', () => {
                if (recorderRef.current) recorderRef.current.stop();
            });
            
            recorderRef.current.onstop = () => {
                if (micStream) {
                    micStream.getTracks().forEach((track) => {
                        track.stop();
                    })
                }
                
                if (screenStream) {
                    screenStream.getTracks().forEach((track) => {
                        track.stop();
                    })
                }
            }
            
            recorderRef.current.start(500);
    }
        
}
    const handleClearText = () => {
        setTranscript("");
    }
    
    return {
        transcript, 
        isStreaming,
        handleStream,
        handleClearText,
        // handleToSRT
    }
}

    
    // https://stackoverflow.com/a/47071576
    const mix = (audioContext: AudioContext, streams: Array<MediaStream | null>) => {
        const dest = audioContext.createMediaStreamDestination();
        streams.forEach(stream => {
            if (stream) {
                const source = audioContext.createMediaStreamSource(stream)
                source.connect(dest);
            }
        })
        return dest.stream
    }
    
  

export default useStream;