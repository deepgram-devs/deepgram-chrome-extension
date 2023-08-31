import React, {useState, useRef } from 'react';
import { Button, Stack, TextField, Input} from '@mui/material';
import { formatTranscription, buildQueryString } from './utils';

import './Panel.css'

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
      resultRef.current.push(results);
      console.log(results);
      const transcript = results["channels"][0]["alternatives"][0]["transcript"];
      setTranscript(transcript);
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
          justifyContent="space-around"
          padding={2}
        > 
        <button className="PrimaryButton" onClick={handleRecord}>{recording ? "End Recording" : "Start Recording"}</button>
        <button className="PrimaryButton" onClick={handleTranscribe}>Transcribe</button>
        <button className="SecondaryButton" onClick={handleClearText}>Clear Text</button>
        </Stack>
        
      </Stack>
        
    );
};