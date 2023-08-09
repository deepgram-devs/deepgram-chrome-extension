import React, { useEffect, useRef, useState } from 'react';
import useStream from './useStream'
import { Box, Stack, Button, TextField, Typography, FormGroup, FormControl, InputLabel, Select, MenuItem} from '@mui/material';

import './Panel.css';

const Panel: React.FC = () => {
  const {transcript, isStreaming, handleStream, handleClearText} = useStream();
  const [projects, setProjects] = useState({});
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedValues, setSelectedValues] = useState({});

  const tokenRef = useRef();
  const handleDropdownChange = (event) => {
    const newSelectedValues = {...selectedValues};
    if (event.target.value) {
      newSelectedValues[event.target.name] = event.target.value;
    } else {
      delete newSelectedValues[event.target.name];
    }

    console.log(newSelectedValues);
    setSelectedValues(newSelectedValues);
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

  useEffect(() => {
    chrome.declarativeNetRequest.updateDynamicRules(
      {
          addRules: [{
              "id": 1,
              "priority": 1,
              "action": {
                  type: 'modifyHeaders',
                  requestHeaders: [
                      { 
                        header: 'origin', 
                        operation: 'set', 
                        value: "https://extension.deepgram.com" 
                      }
                  ],
              },
              "condition": { 
                "urlFilter": "https://manage.deepgram.com", 
                "initiatorDomains": ["galjhlnbbjhaihlbhnanjgpndjmjipfn"],
                "resourceTypes": ["xmlhttprequest"] }
          }
          ],
          removeRuleIds: [1]
      },
  );

    fetch("https://manage.deepgram.com/v1/projects_with_scopes", {
      method: "GET",
    })
    .then(async response => {
      // TODO: Support selection of project id 
      const { projects } = await response.json();
      setProjects(projects);
      const id = projects[0]["project_id"]
      setSelectedProject(id);
      return id;
    })
    .then((id) => {
      const payload = {
        "comment": "auto generated api chrome extension key",
        "dg_internal_tags": [],
        "scopes": ["member"],
        "time_to_live_in_seconds": 300,
      };

      return fetch(`https://manage.deepgram.com/v1/projects/${id}/keys`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      })
    })
    .then(async (response) => {
      const { key } = await response.json();
      tokenRef.current = key;
    });
  }, []); 
  
  return (
      <Stack direction={"column"} >

        <Stack direction={"row"}>
          <Typography> {selectedProject} </Typography>
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
          <Button onClick={() => handleStream(selectedValues, tokenRef.current)}>
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
