import React, { useEffect, useRef, useState } from 'react';
import useStream from './useStream'
import { Stack, Button, TextField, Typography} from '@mui/material';

import './Panel.css';

const Panel: React.FC = () => {
  const {transcript, isStreaming, handleStream, handleClearText} = useStream();
  const [projects, setProjects] = useState({});
  const [selectedProject, setSelectedProject] = useState("");

  const tokenRef = useRef();


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

        <Stack direction={"row"} justifyContent={"center"}> 
          <Button onClick={async () => handleStream(tokenRef.current)}>
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
