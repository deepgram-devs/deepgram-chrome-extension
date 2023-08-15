import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import Header from './components/Header/Header'
import  UrlDialog from './components/Dialog/Dialog';
import './Popup.css';
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

const Popup = () => {
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    fetch("https://manage.deepgram.com/v1/auth/user", {
      method: "GET"
    }).then(async response => {
      const user = await response.json();
      setUser(user);
    });
  }, []);

  const popupMenu = (user) => {
    if (user) {
      return (
        <>
      <List>
          <ListItem>
            <ListItemButton>
              <ListItemText primary="Livestream audio" onClick={handleMic}/>
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
              <ListItemText primary="Record Audio(in dev)"/>
            </ListItemButton>
          </ListItem>
  
          <ListItem>
            <ListItemButton>
              <ListItemText primary="Upload Audio File(in dev)" />
            </ListItemButton>
          </ListItem>
  
          <ListItem>
            <ListItemButton>
              <ListItemText primary="Run Scripts in Tabs(deprecated)" onClick={handleTab}/>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <Box>
          <Typography> Hello {user.first_name} {user.last_name}! </Typography>
        </Box>
      </>
      );
    } else {
      return (
        <div>
          <Typography> You need to login before using Deepgram Services </Typography>
          <Divider />
          <Typography> New to Deepgram? </Typography>
          <Typography> <a href="https://console.deepgram.com/signup" target='_blank'>Signup Here</a> </Typography>
          <Divider />
          <Typography> <a href="https://console.deepgram.com/login" target='_blank'>Login From Console</a> </Typography>
        </div>
      )
    }
  };


  return (
    <div className="App">
      <Header />
      {popupMenu(user)}
    </div>
  );
};


export default Popup;
