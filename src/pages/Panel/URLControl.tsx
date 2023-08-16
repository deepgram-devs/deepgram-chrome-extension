import React, {useState} from 'react';
import { Button, Stack, FormControlLabel, Checkbox, TextField} from '@mui/material';
import { formatTranscription, buildQueryString } from './utils';

export const URLControl = ({tokenRef, resultRef, setTranscript, handleClearText}) => {

    const [url, setUrl] = useState("");

    const handleTextChange = (e) => {
        console.log(e.target.value);
        setUrl(e.target.value);
    };

    const handleTranscribe = async () => {
        const {deepgramOptions} = await chrome.storage.sync.get("deepgramOptions");
        const {_, prerecordedOptions} = deepgramOptions; 
        const queryString = buildQueryString(prerecordedOptions);

        const res = await fetch(`https://api.deepgram.com/v1/listen${queryString}`,
        {
            method: "POST",
            headers: {
                'Authorization': 'Token ' + tokenRef.current,
                'accept': 'application/json',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                url: url
            })
        });

        const {metadata, results} = await res.json();
        resultRef.current.push(results);
        console.log(results);
        const transcript = results["channels"][0]["alternatives"][0]["transcript"];
        setTranscript(transcript);
    };
    

    return (
        <Stack 
          direction={"row"} 
          justifyContent="center"
          padding={2}
          spacing={8}
        > 
        <TextField label="Paste your URL here" onChange={handleTextChange}></TextField>
            <Button variant="outlined" onClick={handleTranscribe}>Transcribe</Button>
            <Button variant="outlined" onClick={handleClearText}>Clear Text</Button>
        </Stack>
    );
};