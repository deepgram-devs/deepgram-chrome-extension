import React from 'react';
import { Button, Stack, FormControlLabel, Checkbox, } from '@mui/material';
import useStream from './useStream';

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
    );
};