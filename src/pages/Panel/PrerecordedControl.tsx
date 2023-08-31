import React, {useState} from 'react';
import { Button, Stack, FormControlLabel, Checkbox, TextField, Input, Typography} from '@mui/material';
import { formatTranscription, buildQueryString } from './utils';

import './Panel.css'

export const PrerecordedControl = ({tokenRef, resultRef, setTranscript, handleClearText}) => {

    const [url, setUrl] = useState("");
    const [file, setFile] = useState(null);

    const handleTextChange = (e) => {
        console.log(e.target.value);
        setUrl(e.target.value);
        setFile(null);
    };

    const handleTranscribe = async () => {
      const {deepgramOptions} = await chrome.storage.sync.get("deepgramOptions");
      const {_, prerecordedOptions} = deepgramOptions; 
      const queryString = buildQueryString(prerecordedOptions);

      let fetchOptions; 
      if (file) {
        fetchOptions = {
          method: "POST",
          headers: {
            'Authorization': 'Token ' + tokenRef.current,
          },
          body: file,
        };
      } else {
        fetchOptions = {
          method: "POST",
          headers: {
            'Authorization': 'Token ' + tokenRef.current,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({url: url}),
        };
      }

      const res = await fetch(`https://api.deepgram.com/v1/listen${queryString}`, fetchOptions);

      const {metadata, results} = await res.json();
      resultRef.current.push(results);
      console.log(results);
      let transcript;
      if (results["channels"][0]["alternatives"][0]["paragraphs"]) {
        transcript = results["channels"][0]["alternatives"][0]["paragraphs"]["transcript"];
      } else {
        transcript = results["channels"][0]["alternatives"][0]["transcript"];
      }
      
      setTranscript(transcript);
    };

    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
  };
    

    return (
      <Stack>
        <Stack 
          direction={"row"} 
          justifyContent={"center"}
          alignItems={"center"}
          minHeight={150}
          spacing={20}
        > 
        <div>
          <label> Paste your URL here</label> <br />
          <input 
            className="URLInput" 
            type="text" 
            placeholder="www.example.com/sample.wav"
            onChange={handleTextChange}
            >
      
          </input>
        </div>
        
        <Stack justifyContent={"center"} alignItems={"center"} style={{margin: "auto"}} >
          <div className='VerticalDivider' style={{height: "18px", paddingBottom: "6px"}}></div>
          <div className="DividerText">Or</div>
          <div className='VerticalDivider' style={{height: "36px", paddingTop: "6px"}}></div>
        </Stack>
      
        <input type='file' onChange={handleFileChange} />

        
        </Stack>
        <Stack
          direction={"row"} 
          justifyContent={"space-around"}
          alignItems={"center"}
        >
          <button  className="PrimaryButton" onClick={handleTranscribe}>Transcribe</button>
          <button className="SecondaryButton" onClick={handleClearText}> Clear Text </button>
        </Stack>
      </Stack>
        
    );
};

