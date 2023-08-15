import React, { useEffect, useRef, useState } from 'react';
import useStream from './useStream';
import { Header } from './Header';
import { Container, Checkbox, Stack, Button, TextField, FormControlLabel} from '@mui/material';

import './Panel.css';
import { toWebVTT, toSTT } from './utils';

const Panel: React.FC = () => {
  const [transcript, setTranscript] = useState("");
  const resultRef = useRef([]);

  const { 
    isStreaming,
    allowMic, 
    handleStream,
    handleAllowMic,
  } = useStream();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const tokenRef = useRef("");


  useEffect(() => {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [{
        "id": 1,
        "priority": 1,
        "action": {
          type: 'modifyHeaders',
          requestHeaders: [{ 
            header: 'origin', 
            operation: 'set', 
            value: "https://extension.deepgram.com" 
          }]},
        "condition": { 
          "urlFilter": "https://manage.deepgram.com", 
          "initiatorDomains": ["galjhlnbbjhaihlbhnanjgpndjmjipfn"],
          "resourceTypes": ["xmlhttprequest"]
        }}],
      removeRuleIds: [1]
      });

    const getProjects = async () => {
      try {
        const res = await fetch("https://manage.deepgram.com/v1/projects_with_scopes", {method: "GET"});
        var { projects } = await res.json();
        setProjects(projects);
        setSelectedProject(projects[0]["project_id"]);
      } catch (error) {
        if (error) { 
          alert("You have not login yet.");
        }
        return;
      }
    };

    getProjects();
  }, []); 

  useEffect(() => {
    const getKey = async () => {
      const payload = {
        "comment": "auto generated api chrome extension key",
        "dg_internal_tags": [],
        "scopes": ["member"],        
        "time_to_live_in_seconds": 6000,
      };

      if (selectedProject) {
        try {
          const res = await fetch(`https://manage.deepgram.com/v1/projects/${selectedProject}/keys`, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
          });
          const { key } = await res.json();
          tokenRef.current = key;
        } catch (error) {
          alert("Cannot use this project. Please check your credits or choose another project.");
        }

      }
    };

    getKey();
  }, [selectedProject]);

  const handleDownload = (e) => {
    let text: string = "";
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    switch (e.target.name) {
      case "transcript":
        text = transcript;
        a.download = "transcript.txt";
        break;
      case "WebVTT":
        text = toWebVTT(resultRef.current);
        a.download = "transcript.vtt";
        break;
      case "STT":
        text = toSTT(resultRef.current);
        a.download = "transcript.stt";
        break;
      default: 
        console.error("Unsupported option");
    }
    const file = new Blob([text], {type: "text/plain"});
    const url = URL.createObjectURL(file);
    a.href = url;
    a.click();
    URL.revokeObjectURL(a.href)
    a.remove();
    
  }

  const handleClearText = () => {
    setTranscript("");
    resultRef.current = [];
  }
  
  return (
      <Stack direction={"column"} >

        <Header 
          projects={projects} 
          selectedProject={selectedProject} 
          setSelectedProject={setSelectedProject}
          />

        <Container maxWidth="md">

        <Stack 
          direction={"row"} 
          justifyContent="center"
          padding={2}
          spacing={8}
        > 
        <FormControlLabel
          control={
            <Checkbox 
              checked={allowMic}
              onClick={handleAllowMic}
            />}
          label="Use Microphone"
        />
       
          <Button 
            size="large"
            variant="outlined"
            color={isStreaming ? "error" : "primary"}
            onClick={handleStream(tokenRef, resultRef, setTranscript)}
          >
            {isStreaming ? "End Livestream" : "Start LiveStream"}
          </Button>
          <Button 
            size="large"
            variant="outlined"
            onClick={handleClearText}
          >
            Clear
          </Button>
        </Stack>

        <TextField 
          multiline
          fullWidth
          variant='filled'
          minRows={20} 
          maxRows={30}
          value={transcript}
          placeholder="Your Transcript Is Here">            
        </TextField>
        </Container>

        <Stack direction={"row"} justifyContent={"center"}> 
          <Button 
            name="transcript" 
            onClick={handleDownload}
          > 
            Download Transcript 
          </Button>
          <Button 
            name="STT" 
            onClick={handleDownload}
          > 
            Download STT 
          </Button>
          <Button 
            name="WebVTT" 
            onClick={handleDownload}
          > 
            Download WebVTT 
          </Button>
        </Stack>

      </Stack>
  );
};


export default Panel;
