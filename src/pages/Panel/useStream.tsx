import { useState, useRef } from "react";
import { formatTranscription, buildQueryString } from "./utils";

const useStream = () => {

  const [allowMic, setAllowMic] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
	
  let screenStream : MediaStream | null = null;
  let micStream : MediaStream | null = null;


  const handleStream = (tokenRef, resultRef, setTranscript) => {
    return async () => {
			const token = tokenRef.current;
			const {deepgramOptions} = await chrome.storage.sync.get("deepgramOptions");
      const {livestreamOptions} = deepgramOptions;

      const queryString = buildQueryString(livestreamOptions);
      console.log(queryString);
      if (!token) {
				alert("Session expired. Please login and refresh page.");
      } else if (isStreaming) {
        setIsStreaming(false);  
        if (socketRef.current) socketRef.current.close();
        if (recorderRef.current) recorderRef.current.stop();
      } else {
        setIsStreaming(true);

				try {
					screenStream = await navigator.mediaDevices.getDisplayMedia({audio: true});
				} catch (err) {
					if (err.name !== 'NotAllowedError') {
						console.error(err);
					}
				};
							
				if (allowMic) {
					try {
						micStream = await navigator.mediaDevices.getUserMedia({audio: true});
					} catch (err) {
						if (err.name !== 'NotAllowedError') {
							console.error(err);
						}
					};
				}

				try {
					socketRef.current = new WebSocket(`wss://api.deepgram.com/v1/listen?${queryString}`, ['token', token]);
					socketRef.current.addEventListener('error', (err) => {
						setIsStreaming(false);
						if (socketRef.current) socketRef.current.close();
						if (recorderRef.current) recorderRef.current.stop();
						if (screenStream) {
							screenStream.getTracks().forEach(track => track.stop());
						}
						if (micStream) {
							micStream.getTracks().forEach(track => track.stop());
						}
					});
				} catch (error) {
          console.error(error);
					setIsStreaming(false);
        	alert("Failed to establish connection. Please make sure you have enough credit in your project.");
				}
                
      const audioContext = new AudioContext();
      const mixed = mix(audioContext, [screenStream, micStream])
      recorderRef.current = new MediaRecorder(mixed, {mimeType: 'audio/webm'});
                
      socketRef.current.addEventListener('message', msg => {
        const data = JSON.parse(msg.data);
        if (!data.channel) {
        // Server will send metadata if it closes the connection. 
        // Todo: tell user to restart
          if (socketRef.current) socketRef.current.close();
          if (recorderRef.current) recorderRef.current.stop();
            setIsStreaming(false);
						alert("Failed to start the streaming service. Please retry");
            return;
        } else if (data.channel) {
					if (data["channel"]["alternatives"][0]["words"].length > 0) {
						resultRef.current.push(data);
						setTranscript(previous => {
              return previous + formatTranscription(data, livestreamOptions);
            });
					}
        }});

            
        recorderRef.current.ondataavailable = (evt : any) => {
          if (socketRef.current && evt.data.size > 0 
            && socketRef.current.readyState === socketRef.current.OPEN) {
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
            });
          }
                
          if (screenStream) {
            screenStream.getTracks().forEach((track) => {
              track.stop();
            });
          }
        };
          
				recorderRef.current.start(1000);
    }
}
        
	}

  const handleAllowMic = () => {
    setAllowMic(!allowMic);
  }
  
    
  return {
    isStreaming,
    allowMic, 
    handleStream,
    handleAllowMic,
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
    return dest.stream;
  }
    
  

export default useStream;