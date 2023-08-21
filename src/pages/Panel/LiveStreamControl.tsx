import React from 'react';
import { Button, Stack, FormControlLabel, Checkbox } from '@mui/material';
import useStream from './useStream';

import './Panel.css'

export const LiveStreamControl = ({tokenRef, resultRef, setTranscript, handleClearText}) => {
    const { 
        isStreaming,
        allowMic, 
        handleStream,
        handleAllowMic,
      } = useStream();

    return (
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
              style={{
                color: "#13EF93"
              }}
            />}
          label="Use Microphone"
          style={{
            color: "#E1E1E5"
          }}
        />
       
          <Button 
            size="large"
            sx={{
              color: "#FBFBFF",
              textAlign: "center",
              fontFamily: 'Inter',
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "100%",
              textTransform: "capitalize",
            }}
            color={isStreaming ? "error" : "primary"}
            onClick={handleStream(tokenRef, resultRef, setTranscript)}
          >
            {isStreaming ? "End Livestream" : "Start LiveStream"}
          </Button>
          <Button 
            size="large"
            sx={{
              color: "#FBFBFF",
              textAlign: "center",
              fontFamily: 'Inter',
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "100%",
              textTransform: "capitalize",
            }}
            onClick={handleClearText}
          >
            Clear
          </Button>
        </Stack>
    );
};