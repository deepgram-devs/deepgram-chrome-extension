import React, {useState} from 'react';
import { Button, Stack, FormControlLabel, Checkbox, TextField, Input} from '@mui/material';
import { formatTranscription, buildQueryString } from './utils';

export const URLControl = ({tokenRef, resultRef, setTranscript, handleClearText}) => {

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
      const transcript = results["channels"][0]["alternatives"][0]["transcript"];
      setTranscript(transcript);
    };

    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
  };
    

    return (
      <Stack>
        <Stack 
          direction={"row"} 
          justifyContent="center"
          padding={2}
          spacing={8}
        > 
        <TextField label="Paste your URL here" onChange={handleTextChange}></TextField>
        <input type='file' onChange={handleFileChange} />
        <Button variant="outlined" onClick={handleTranscribe}>Transcribe</Button>
        <Button variant="outlined" onClick={handleClearText}>Clear Text</Button>
        </Stack>
        
      </Stack>
        
    );
};