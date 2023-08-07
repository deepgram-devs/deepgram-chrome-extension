import React, { useEffect, useState } from 'react';
import useStream from './useStream'
import { Box, Stack, Button, Grid, TextField, Typography, FormGroup, FormControl, InputLabel, Select, MenuItem} from '@mui/material';

import './Panel.css';

const Panel: React.FC = () => {
  const {transcript, isStreaming, handleStream, handleClearText} = useStream();
  const [projectId, setProjectId] = useState("");
  
  const [selectedValues, setSelectedValues] = useState({});
  const [queryString, setQueryString] = useState("")
  const handleDropdownChange = (event) => {
    const newSelectedValues = {...selectedValues};
    if (event.target.value) {
      newSelectedValues[event.target.name] = event.target.value;
    } else {
      delete newSelectedValues[event.target.name];
    }

    console.log(newSelectedValues);
    var queryString = "";
    for (const key in newSelectedValues) {
      const value = newSelectedValues[key];
      if (queryString.length > 0) {
        queryString += ("&" + key + "=" + value)
      } else {
        queryString = (key + "=" + value);
      }
    }

    setSelectedValues(newSelectedValues);
    setQueryString(queryString);
  };

  const queryParams = [
    {label: 'Model', key: 'model', options: ['general', 'meeting', 'phonecall', '']},
    {label: 'Tier', key: 'tier', options: ['', 'enhanced', 'base']},
    {label: 'Languages', key: 'language', options:['', 'da', 'en', 'en-AU', 'en-GB', 'en-IN', 'en-NZ',
    'en-US', 'es', 'es-419', 'fr', 'fr-CA', 'hi', 'hi-Latn', 'id',
    'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'pt-PT', 'pt-BR', 'ru', 'sv',
    'tr', 'uk', 'zh-CN', 'zh-TW']},
    {label: 'Punctuate', key: 'punctuate', options:['', 'true', 'false']},
    {label: 'Profanity Filter', key:'profanity_filter', options:['', 'true', 'false']},
    {label: 'Diarize', key:'diarize', options:['', 'true', 'false']},
    {label: 'Smart Format', key:'smart_format', options:['', 'true', 'false']},
    {label: 'Multichannel', key:'multichannel', options:['', 'true', 'false']},
    {label: 'Numerals', key:'numerals', options:['', 'true', 'false']},
    {label: 'Interim Results', key:'interim_results', options:['', 'true', 'false']}
  ];

  chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === 'Origin') {
        details.requestHeaders[i].value = 'https://extension.deepgram.com';
      }
    }
    return {requestHeaders: details.requestHeaders};
    }, {
        urls: ["https://manage.deepgram.com.com/*"]
    },
    ["blocking", "requestHeaders", "extraHeaders"]);

  useEffect(() => {
    fetch("https://manage.deepgram.com/v1/projects_with_scopes", {
      method: "GET",
    })
    .then(async response => {
      const { projects } = await response.json();
      const id = projects[0]["project_id"]
      setProjectId(id);
      return id;
    })
    .then((id) => {
      // const payload = {
      //   "comment": "auto generated api chrome extension key",
      //   "scopes": ["member"],
      //   "time_to_live_in_seconds": 300,
      // };

      // return fetch(`https://manage.deepgram.com/v1/projects/${id}/keys`, {
      //   method: "POST",
      //   body: JSON.stringify(payload),
      // })

      return fetch(`https://manage.deepgram.com/v1/projects/${id}/keys`, {
        method: "GET"
      })
    })
    .then(async (response) => {
      const { apiKeys } = await response.json();
      console.log(apiKeys);
    });
  }, []); 
  
  return (
      <Stack direction={"column"} >

        <Stack direction={"row"}>
          <Typography> {projectId} </Typography>
        </Stack>

        <Stack>
          <Box sx={{padding: 2}}>
          <FormGroup>
            {queryParams.map((param, index) => (
            <FormControl key={index} variant="outlined">
              <InputLabel>{param.label}</InputLabel>
              <Select
                key={index}
                name={param.key}
                value={selectedValues[param.key] || ''}
                onChange={handleDropdownChange}
              > 
                {param.options.map((option, idx) => {
                  return <MenuItem key={idx} value={option}>{option}</MenuItem>
                })}
              </Select>
            </FormControl>
            ))}
          </FormGroup>
          </Box>
          
        </Stack>

        <Stack direction={"row"} justifyContent={"center"}> 
          <Button onClick={handleStream(selectedValues)}>
            {isStreaming ? "End Livestream" : "Start LiveStream"}
          </Button>
          <Button onClick={handleClearText}>Clear</Button>
          <Button> Download STT </Button>
          <Button> Download WebVTT </Button>
        </Stack>

        <TextField 
          multiline
          variant='filled'
          value={transcript} 
          minRows={20} 
          maxRows={100} 
          placeholder="Your Transcript Is Here">            
        </TextField>

      </Stack>
  );
};


export default Panel;
