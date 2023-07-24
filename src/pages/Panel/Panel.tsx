import React from 'react';
import useStream from './useStream'
import { Stack, Button, TextField} from '@mui/material';

import './Panel.css';

const Panel: React.FC = () => {
  const {transcript, isStreaming, handleStream, handleClearText} = useStream();
  
  return (
      <Stack direction={"column"} >
        <Stack direction={"row"} justifyContent={"center"}> 
          <Button 
          onClick={handleStream}
          >{isStreaming ? "End Livestream" : "Start LiveStream"}</Button>
          <Button onClick={handleClearText}>Clear</Button>
        </Stack>

          <TextField 
            multiline
            variant='filled'
            value={transcript} 
            minRows={20} 
            maxRows={Infinity} 
            placeholder="Your Transcript Is Here">
            
            </TextField>
      </Stack>
  );
};


export default Panel;
