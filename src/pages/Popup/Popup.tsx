import React from 'react';
import Logo from '../../assets/img/wordmark.svg';
import { useState, useEffect } from 'react';

import './Popup.css';
import {  Button, Typography } from '@mui/material';

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
        <>
          <Button className="PrimaryButton" variant="contained" onClick={handleTranscribe}> Transcribe </Button>
          <Button className="PrimaryButton" variant="contained" onClick={handleOption}> Settings</Button>
        </>
      );
    } else {
      return (
        <>
          <Typography 
            sx={{
              color: "#E1E1E5",
              fontFamily: 'ABC Favorit',
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "140%"
            }}
            > Transcribe and understand audio with deep learning. </Typography>
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
        </>
      )
    }
  };


  return (
    <div className="App">
      <img className="logo" src={Logo} alt="Logo" />
      <div className="Menu">
        {popupMenu(user)}
      </div>
    </div>
  );
};


export default Popup;
