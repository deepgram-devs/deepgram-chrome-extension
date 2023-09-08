import React from 'react';
import { styled, Stack, Switch, Typography } from '@mui/material';
import useStream from './useStream';
import Logo from '../../assets/img/wordmark.svg';
import Alf from '../../assets/img/alf.svg';

import './App.css';

export const LiveStreamControl = ({
  tokenRef,
  resultRef,
  setTranscript,
  handleClearText,
}) => {
  const { isStreaming, allowMic, handleStream, handleAllowMic } = useStream();

  return (
    <div className="livestream">
      <div className="title">
        <img className="logo" src={Logo} alt="Logo" /> <h1> Transcription</h1>
        <img className="alf" src={Alf} />
      </div>
      <div className="livestream-container">
        <Stack
          direction={'row'}
          justifyContent={'left'}
          alignItems={'center'}
          spacing={2}
          minWidth={200}
          minHeight={200}
        >
          {ToggleSwitch(allowMic, handleAllowMic)}
        </Stack>
        <button
          className="PrimaryButton"
          color={isStreaming ? 'error' : 'primary'}
          onClick={handleStream(tokenRef, resultRef, setTranscript)}
        >
          {isStreaming ? 'End Livestream' : 'Start LiveStream'}
        </button>
        <button className="clear-button" onClick={handleClearText}>
          Clear
        </button>
      </div>
    </div>
  );
};

const ToggleSwitch = (allowMic, handleAllowMic) => {
  if (allowMic) {
    return (
      <>
        <AntSwitch checked={allowMic} onClick={handleAllowMic} />
        <Typography className="Label">Include Mic</Typography>
      </>
    );
  } else {
    return (
      <>
        <AntSwitch checked={allowMic} onClick={handleAllowMic} />
        <Typography className="Label">Tab Audio Only</Typography>
      </>
    );
  }
};

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 56,
  height: 30,
  padding: 0,
  display: 'flex',
  flexShrink: 0,
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 26,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(25px)',
      color: '#232329',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#13EF93',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 26,
    height: 26,
    borderRadius: 14,
    color: '#232329',
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 34 / 2,
    opacity: 1,
    backgroundColor: '#BBBBBF',
    boxSizing: 'border-box',
  },
}));
