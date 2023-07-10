import React from 'react';
import { useState } from 'react';
import Header from './Header'
import './Popup.css';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

const Popup = () => {
  const [transcript, setTranscript] = useState("This is transcript");

  return (
    <div className="App">
      <Header />
      <List>
        <ListItem>
          <ListItemButton>
            <ListItemText primary="Record Audio" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <ListItemText primary="Upload From URL" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <ListItemText primary="Upload Audio File" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <ListItemText primary="Capture From Tab" />
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
