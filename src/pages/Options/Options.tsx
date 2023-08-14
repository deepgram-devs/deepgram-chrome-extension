import React, { useEffect, useState } from 'react';
import './Options.css';
import { Box, Container, Button, FormGroup, FormControl, InputLabel, Select, MenuItem} from '@mui/material';


const queryParams = [
  {label: 'Model', key: 'model', options: ['general', 'meeting', 'phonecall', '']},
  {label: 'Tier', key: 'tier', options: ['', 'enhanced', 'base']},
  {label: 'Languages', key: 'language', options:['', 'da', 'en', 'en-AU', 'en-GB', 'en-IN', 'en-NZ',
  'en-US', 'es', 'es-419', 'fr', 'fr-CA', 'hi', 'hi-Latn', 'id',
  'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'pt-PT', 'pt-BR', 'ru', 'sv',
  'tr', 'uk', 'zh-CN', 'zh-TW']},
  {label: 'Punctuate', key: 'punctuate', options:['', 'true', 'false']},
  {label: 'Profanity Filter', key:'profanity_filter', options:['', 'true', 'false']},
  {label: 'Diarize', key:'diarize', options:['', 'true', 'false']},
  {label: 'Smart Format', key:'smart_format', options:['', 'true', 'false']},
  {label: 'Filler Words', key:'filler_words', options:['', 'true', 'false']},
  {label: 'Multichannel', key:'multichannel', options:['', 'true', 'false']},
  {label: 'Numerals', key:'numerals', options:['', 'true', 'false']},
  {label: 'Interim Results', key:'interim_results', options:['', 'true', 'false']}
];

const Options: React.FC = () => {
  const [selectedOptions, setselectedOptions] = useState({});
  

  useEffect(() => {
    chrome.storage.sync.get("livestreamOptions")
    .then((result) => {
      const {livestreamOptions} = result;
      setselectedOptions(livestreamOptions);
    })
  }, []);

  const handleDropdownChange = (event) => {
    const newselectedOptions = {...selectedOptions};
    if (event.target.value) {
      newselectedOptions[event.target.name] = event.target.value;
    } else {
      delete newselectedOptions[event.target.name];
    }
    setselectedOptions(newselectedOptions);
  };
  
  const handleSave = () => {
    chrome.storage.sync.set({
      livestreamOptions: selectedOptions
    })
  }


  return (
    <div>
     <Container maxWidth="sm" >
     <FormGroup >
      {queryParams.map((param, index) => (
        <FormControl key={index} variant="outlined" margin="dense">
          <InputLabel>{param.label}</InputLabel>
            <Select
                key={index}
                name={param.key}
                value={selectedOptions[param.key] || ''}
                onChange={handleDropdownChange}
              > 
                {param.options.map((option, idx) => {
                  return <MenuItem key={idx} value={option}>{option}</MenuItem>
                })}
              </Select>
            </FormControl>
            ))}
      </FormGroup>
     </Container>
     <Container maxWidth="sm">
      <Box
        display="flex" 
        justifyContent="center" 
        alignItems="center"
      >

      </Box>
     </Container>
      <Container maxWidth="sm">
        <Box
          display="flex" 
          justifyContent="center" 
          alignItems="center"
        >
          <Button onClick={handleSave}> Save Options </Button>
        </Box>
      </Container>
      
        
      
    </div>
  );
};

export default Options;
