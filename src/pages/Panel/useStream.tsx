import { useState, useRef } from "react";

const useStream = () => {
    const [transcript, setTranscript] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const socketRef = useRef<WebSocket>(null);
    const recorderRef = useRef<MediaRecorder>(null);

    const handleStream = async (options, token) => {
        var queryString = "";
        for (const key in options) {
            const value = options[key];
            if (queryString.length > 0) {
                queryString += ("&" + key + "=" + value)
            } else {
                queryString = (key + "=" + value);
            }
        }

            if (isStreaming) {
                setIsStreaming(false);  
                if (socketRef.current) socketRef.current.close();
            } else {
                setIsStreaming(true);
                socketRef.current = new WebSocket(`wss://api.deepgram.com/v1/listen?${queryString}`, ['token', token])
                const screenStream = await(navigator.mediaDevices.getDisplayMedia({audio: true}));
                const micStream = await navigator.mediaDevices.getUserMedia({audio: true});
                
                const audioContext = new AudioContext();
                const mixed = mix(audioContext, [screenStream, micStream])
                recorderRef.current = new MediaRecorder(mixed, {mimeType: 'audio/webm'});
                
                socketRef.current.addEventListener('message', msg => {
                    const data = JSON.parse(msg.data);
                    console.log(data);
                    if (!data.channel) {
                    // Server will send  metadata if it closes the connection. 
                        if (socketRef.current) socketRef.current.close();
                        if (recorderRef.current) recorderRef.current.stop();
                        setIsStreaming(false);
                        return;
                } else if (data.channel) {
                        setTranscript(previous => {
                            return previous + formatTranscription(data, options);
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
                micStream.getTracks().forEach((track) => {
                    track.stop();
                })
                screenStream.getTracks().forEach((track) => {
                    track.stop();
                })
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
    handleClearText
  }
}

    
    // https://stackoverflow.com/a/47071576
    const mix = (audioContext: AudioContext, streams: Array<MediaStream>) => {
        const dest = audioContext.createMediaStreamDestination()
        streams.forEach(stream => {
            const source = audioContext.createMediaStreamSource(stream)
            source.connect(dest);
        })
        return dest.stream
    }
    
    // 
    const formatTranscription = (data: any, options: any) : string => {
        console.log(options);
        let result = data.channel.alternatives[0];
        if (options.diarize) {
            let speakers = {};
            result.words.forEach(wordBase => {
                let {speaker, word} = wordBase;
                speaker = speaker.toString();
                if (speakers[speaker]) {
                    speakers[speaker] += (" " + word);
                } else {
                    speakers[speaker] = word;
                }
            });
            
            let transcript = "";
            for (const speaker in speakers) {
                transcript += ("[Speaker " + speaker + "] " + speakers[speaker] + "\n");
            }
            return transcript;
        } else {
            let transcript = result.transcript;
            if (".?!".includes(transcript.slice(-1))) transcript += "\n";
            return transcript;
        }
    }

  

export default useStream;