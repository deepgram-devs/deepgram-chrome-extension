import React, { useState, useRef } from 'react';
import { Button, Typography } from '@mui/material';
import secret from '../../../secrets.development'
import './Panel.css';

const Panel: React.FC = () => {
  const [transcript, setTranscript] = useState("This is transciprt: ");
  const [isStreaming, setIsStreaming] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const handleStream = async () => {
    if (isStreaming) {
      setIsStreaming(false);
      socketRef.current.close();
      
    } else {
      setIsStreaming(true);
      socketRef.current = new WebSocket('wss://api.deepgram.com/v1/listen?model=general-enhanced', ['token', secret.APIKey])
      const micStream = await navigator.mediaDevices.getUserMedia({audio: true});
      recorderRef.current = new MediaRecorder(micStream, {mimeType: 'audio/webm'});

      socketRef.current.addEventListener('message', msg => {
        const data = JSON.parse(msg.data);
        console.log(data);
        if (data.channel && data.channel.alternatives[0].transcript) {
          setTranscript(previous => {
            return previous + " " + data.channel.alternatives[0].transcript
          });
        }
      });

      recorderRef.current.ondataavailable = (evt : any) => {
        if (evt.data.size > 0 && socketRef.current.readyState == socketRef.current.OPEN) {
          console.log("data avaiable, sending through wss");
          socketRef.current.send(evt.data)
        }
      }
      
      socketRef.current.addEventListener('close', () => {
        recorderRef.current.stop();
      });

      recorderRef.current.onstop = () => {
      micStream.getTracks().forEach((track) => {
        track.stop();
      })
      
    }
    
    recorderRef.current.start(250)

    }
    
  }
  
  return (
    <div className="container">
      <Button onClick={handleStream}>{isStreaming ? "End Livestream" : "Start LiveStream"}</Button>
      <Typography>{transcript}</Typography>
    </div>
  );
};


export default Panel;
