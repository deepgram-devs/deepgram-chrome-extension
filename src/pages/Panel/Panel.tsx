import React, { useState, useRef } from 'react';
import { Stack, Button, TextField, Grid} from '@mui/material';
import secret from '../../../secrets.development'
import './Panel.css';

const Panel: React.FC = () => {
  const [transcript, setTranscript] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const handleStream = async () => {
    if (isStreaming) {
      setIsStreaming(false);
      if (socketRef.current) socketRef.current.close();
    } else {
      setIsStreaming(true);
      socketRef.current = new WebSocket('wss://api.deepgram.com/v1/listen?diarize=true&smart_format=true', ['token', secret.APIKey])
      const screenStream = await(navigator.mediaDevices.getDisplayMedia({audio: true}));
      const micStream = await navigator.mediaDevices.getUserMedia({audio: true});
      const audioContext = new AudioContext();
      const mixed = mix(audioContext, [screenStream, micStream])
      recorderRef.current = new MediaRecorder(mixed, {mimeType: 'audio/webm'});

      socketRef.current.addEventListener('message', msg => {
        const data = JSON.parse(msg.data);
        console.log(data);
        if (!data.channel) {
          // Server will send a metadata if it closes the connection. 
          if (socketRef.current) socketRef.current.close();
          if (recorderRef.current) recorderRef.current.stop();
          setIsStreaming(false);
          return;
        } else if (data.channel.alternatives[0].transcript) {
          setTranscript(previous => {
            return previous + " " + data.channel.alternatives[0].transcript
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
    
      recorderRef.current.start(250)

    }
    
  }

  // https://stackoverflow.com/a/47071576
  function mix(audioContext: AudioContext, streams: Array<MediaStream>) {
    const dest = audioContext.createMediaStreamDestination()
    streams.forEach(stream => {
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(dest);
    })
    return dest.stream
  } 

  const handleClearText = () => {
    setTranscript("");
  }

  
  return (
      <Stack direction={"column"} >
        <Stack direction={"row"} justifyContent={"center"}> 
          <Button 
          onClick={handleStream}
          >{isStreaming ? "End Livestream" : "Start LiveStream"}</Button>
          <Button onClick={handleClearText}>Clear</Button>
        </Stack>

          <TextField 
            multiline
            variant='filled'
            value={transcript} 
            minRows={20} 
            maxRows={Infinity} 
            placeholder="Your Transcript Is Here">
            
            </TextField>
      </Stack>
  );
};


export default Panel;
