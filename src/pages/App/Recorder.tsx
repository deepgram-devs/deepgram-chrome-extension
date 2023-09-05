import React, {useState, useRef } from 'react';
import { Stack, Typography } from '@mui/material';
import { buildQueryString } from './utils';
import MicOn from '../../assets/img/mic-on.svg';
import MicOff from '../../assets/img/mic-off.svg';

import './App.css'

export const Recorder = ({tokenRef, resultRef, setTranscript, handleClearText}) => {

    const [recording, setRecording] = useState(false);
    const audioBlobRef = useRef(null);
    const recorderRef = useRef(null);
    
    
    const handleTranscribe = async () => {
        const {deepgramOptions} = await chrome.storage.sync.get("deepgramOptions");
        const {_, prerecordedOptions} = deepgramOptions; 
        const queryString = buildQueryString(prerecordedOptions);

        const fetchOptions = {
            method: "POST",
            headers: {
                'Authorization': 'Token ' + tokenRef.current,
            },
            body: audioBlobRef.current,
        };

      const res = await fetch(`https://api.deepgram.com/v1/listen${queryString}`, fetchOptions);

      const {metadata, results} = await res.json();
      if (results) {
        resultRef.current.push({metadata, results});
        console.log(results);
        let transcript;
        if (results["channels"][0]["alternatives"][0]["paragraphs"]) {
          transcript = results["channels"][0]["alternatives"][0]["paragraphs"]["transcript"];
        } else {
          transcript = results["channels"][0]["alternatives"][0]["transcript"];
        }
      
        setTranscript(transcript);
      } else {
        alert("Receive an empty result from the backend. Please check your input source");
      }
      
    };

    const handleRecord = async() => {
        if (!recording) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioChunk = [];
            recorderRef.current = new MediaRecorder(stream);
            recorderRef.current.ondataavailable = event => {
                audioChunk.push(event.data);
            };
            recorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunk, {
                    type: 'audio/wav'
                });

                audioBlobRef.current = audioBlob; 

                stream.getTracks().forEach((track) => {
                    track.stop();
                })
            };

            recorderRef.current.start();
            setRecording(true);

        } else {
            if (recorderRef.current) {
                recorderRef.current.stop();
            }
            setRecording(false);
        }
    }
    

    return (
      <Stack>
        <Stack 
          direction={"row"} 
          justifyContent={"space-around"}
          alignItems={"center"}
          minHeight={100}
        > 
        <div
            className="Record"
            onClick={handleRecord}
        >
            <Typography className="Label"> {recording ? "End Recording" : "Start Recording"} </Typography>
            <img src={recording ? MicOn : MicOff} alt="Logo" style={{height: "32px"}}/>
            
        </div>
        <button className="PrimaryButton" onClick={handleTranscribe}>Transcribe</button>
        <button className="SecondaryButton" onClick={handleClearText}>Clear Text</button>
        </Stack>
        
      </Stack>
        
    );
};