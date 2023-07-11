import React, { useRef } from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import secret from '../../../../../secrets.development.js';
import { Button, TextField } from '@mui/material';

export interface UrlDialogProps {
    open: boolean;
    url: string;
    onUrlChange: (e: any) => void;
    onTranscriptChange: (value: string) => void;
    onClose: (value: string) => void;
  }

const UrlDialog = (props: UrlDialogProps) => {

    const { onClose, onUrlChange, onTranscriptChange, url, open } = props;
    const handleClose = () => {
        onClose(url);
    };

    const handleTranscript = async () => {
        const res = await fetch("https://api.deepgram.com/v1/listen",
        {
            method: "POST",
            headers: {
                'Authorization': 'Token ' + secret.APIKey,
                'accept': 'application/json',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                url: url
            })
        });

        const result = await res.json();
        // TODO; enable parsing 
        onTranscriptChange(result["results"]["channels"][0]["alternatives"][0]["transcript"])
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Paste the URL of audio to transcribe </DialogTitle>
            <TextField label="Paste your URL here" onChange={onUrlChange}></TextField>
            <Button variant="outlined" onClick={handleTranscript}>Transcribe</Button>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        </Dialog>
    )
}

export default UrlDialog;