import React from 'react';
import DeepgramLogo from '../../assets/img/wordmark.svg';
import { useState, useEffect } from 'react';

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
      <img className="logo" src={DeepgramLogo} alt="Deepgram Logo" />
      {popupMenu(user)}
    </div>
  );
};


export default Popup;
