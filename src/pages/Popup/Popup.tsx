import React from 'react';
import DeepgramLogo from '../../assets/img/wordmark.svg';
import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';

import './Popup.css';
import { Divider, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

const Popup = () => {
  const [user, setUser] = useState(null);

  // Capture Mic
  const handleTranscribe = async () => {
    chrome.tabs.create({url: 'panel.html'});
  }

  const handleOption = () => {
    chrome.tabs.create({url: 'options.html'});
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
      <List>
          <ListItem>
            <ListItemButton>
              <ListItemText className="PopupButton" primary="Start Transcribe" onClick={handleTranscribe}/>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemText className="PopupButton" primary="Settings" onClick={handleOption}/>
            </ListItemButton>
          </ListItem>
        </List>
      );
    } else {
      return (
        <Stack 
          padding={2}
          spacing={2}
          justifyContent={"space-between"}
          >
          <Typography 
            sx={{
              color: "#E1E1E5",
              fontFamily: 'Inter',
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "145%"
            }}
            > Transcribe and understand audio with deep learning. </Typography>
          <Divider />
          <Typography 
            sx={{
              color: "#E1E1E5",
              fontFamily: 'Inter',
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "145%"
            }}
          > New to Deepgram? <a href="https://console.deepgram.com/signup" target='_blank'>Sign up free</a> </Typography>
          <Divider />
          <Typography 
            sx={{
              color: "#E1E1E5",
              fontFamily: 'Inter',
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "145%"
            }}
          > Already have an account <a href="https://console.deepgram.com/login" target='_blank'>Log in</a> </Typography>
        </Stack>
      )
    }
  };


  return (
    <div className="App">
      <img className="logo" src={DeepgramLogo} alt="Deepgram Logo" />
      {popupMenu(user)}
    </div>
  );
};


export default Popup;
