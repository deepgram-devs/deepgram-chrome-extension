import React, { useEffect, useRef, useState } from 'react';
import useStream from './useStream'
import { Container, Stack, Button, TextField, Typography} from '@mui/material';

import './Panel.css';
import { toWebVTT } from './utils';

const Panel: React.FC = () => {
  const {transcript, isStreaming, resultRef, handleStream, handleClearText} = useStream();
  const [projects, setProjects] = useState({});
  const [selectedProject, setSelectedProject] = useState("");

  const tokenRef = useRef("");


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

  const handleDownload = (e) => {
    let text: string = "";
    switch (e.target.name) {
      case "transcript":
        text = transcript;
        break;
      case "WebVTT":
        text = toWebVTT(resultRef.current);
        break;
      case "STT":
        text = "";
        break;
      default: 
        console.error("Unsupported option");
    }
    const file = new Blob([text], {type: "text/plain"});
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    const url = URL.createObjectURL(file);
    a.download = "transcript.txt";
    a.href = url;
    a.click();
    URL.revokeObjectURL(a.href)
    a.remove();
    
  }
  
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
        </Stack>

        <Container maxWidth="md">
        <TextField 
          multiline
          fullWidth
          variant='filled'
          value={transcript} 
          minRows={20} 
          maxRows={30} 
          placeholder="Your Transcript Is Here">            
        </TextField>
        </Container>

        <Stack direction={"row"} justifyContent={"center"}> 
          <Button name="transcript" onClick={handleDownload}> Download Transcript </Button>
          <Button name="STT" onClick={handleDownload}> Download STT </Button>
          <Button name="WebVTT" onClick={handleDownload}> Download WebVTT </Button>
        </Stack>

      </Stack>
  );
};


export default Panel;
