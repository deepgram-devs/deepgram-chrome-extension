import React from 'react';
import { useState } from 'react';
import Header from './components/Header/Header'
import  UrlDialog from './components/Dialog/Dialog';
import './Popup.css';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

const Popup = () => {
  const [transcript, setTranscript] = useState("This is transcript");

  // URl buttons
  const [openDialog, setOpenDialog] = useState(false);
  const [url, setURl] = useState("");


  const handleClickOpenUrl = () => {
    setOpenDialog(true);
  }

  const handleClose = () => {
    setOpenDialog(false);
  }

  const handleUrlChange = (e: any) => {
    setURl(e.target.value);
  }

  // Capture Mic
  const handleMic = async () => {
    const tab = await chrome.tabs.create({url: 'panel.html'});
  }

  // Run Scripts in Tabs
  const handleTab = async () => {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      files: ["audiostream.bundle.js"]
    });

  }

  return (
    <div className="App">
      <Header />
      <List>
        <ListItem>
          <ListItemButton>
            <ListItemText primary="Record Audio"/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton>
            <ListItemText primary="Upload From URL" onClick={handleClickOpenUrl}/>
          </ListItemButton>
          <UrlDialog open={openDialog} url={url} 
          onClose={handleClose}
          onUrlChange={handleUrlChange}
          onTranscriptChange={setTranscript}
          />
        </ListItem>

        <ListItem>
          <ListItemButton>
            <ListItemText primary="Upload Audio File" />
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton>
            <ListItemText primary="Run Scripts in Tabs(deprecated)" onClick={handleTab}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton>
            <ListItemText primary="Livestream audio" onClick={handleMic}/>
          </ListItemButton>
        </ListItem>

      </List>
      <Box>
        <Typography> {transcript} </Typography>
      </Box>
    </div>
  );
};

export default Popup;
