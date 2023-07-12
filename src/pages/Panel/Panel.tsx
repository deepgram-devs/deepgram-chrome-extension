import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import secret from '../../../secrets.development'
import './Panel.css';

const Panel: React.FC = () => {
  const [transcript, setTranscript] = useState("This is transciprt: ");
  const [isStreaming, setIsStreaming] = useState(false);
  
  let socket: WebSocket

  const handleStream = async () => {
    if (isStreaming) {
      setIsStreaming(false);
      socket.close();
      
    } else {
      setIsStreaming(true);
      socket = new WebSocket('wss://api.deepgram.com/v1/listen?model=general-enhanced', ['token', secret.APIKey])
      const micStream = await navigator.mediaDevices.getUserMedia({audio: true});
      const recorder = new MediaRecorder(micStream, {mimeType: 'audio/webm'});

      socket.addEventListener('message', msg => {
        const data = JSON.parse(msg.data).channel.alternatives[0].transcript;
        console.log(data);
        if (data) {
          setTranscript(previous => {
            return previous + " " + data
          });
        }
      });

      recorder.ondataavailable = (evt : any) => {
        if (evt.data.size > 0 && socket.readyState == socket.OPEN) {
          console.log("data avaiable, sending through wss");
          socket.send(evt.data)
        }
      }
      
      socket.addEventListener('close', () => {
        recorder.stop();
      });

      recorder.onstop = () => {
      micStream.getTracks().forEach((track) => {
        track.stop();
      })
      
    }
    
    recorder.start(250)

    }
    
  }
  
  return (
    <div className="container">
      <Button onClick={handleStream}>Record</Button>
      <Typography>{transcript}</Typography>
    </div>
  );
};


export default Panel;
