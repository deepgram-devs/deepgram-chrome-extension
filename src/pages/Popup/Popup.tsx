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
            <ListItemText primary="Capture From Tab" />
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton>
            <ListItemText primary="Capture From Mic" />
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
