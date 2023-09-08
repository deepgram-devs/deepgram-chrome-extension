import React, { useState } from 'react';
import { Stack, Container } from '@mui/material';
import { formatTranscription, buildQueryString } from './utils';

import './App.css';

export const PrerecordedControl = ({
  tokenRef,
  resultRef,
  setTranscript,
  handleClearText,
}) => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const waves = [1, 2, 3, 4, 5];

  const handleTextChange = (e) => {
    setUrl(e.target.value);
    setFile(null);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible); // Toggle the value (from true to false or vice versa)
  };

  const handleTranscribe = async () => {
    setIsTranscribing(true);
    const { deepgramOptions } = await chrome.storage.local.get(
      'deepgramOptions'
    );
    const prerecordedOptions = deepgramOptions
      ? deepgramOptions.prerecordedOptions
      : {};
    const queryString = buildQueryString(prerecordedOptions);

    let fetchOptions;
    if (file) {
      fetchOptions = {
        method: 'POST',
        headers: {
          Authorization: 'Token ' + tokenRef.current,
        },
        body: file,
      };
    } else {
      fetchOptions = {
        method: 'POST',
        headers: {
          Authorization: 'Token ' + tokenRef.current,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
      };
    }

    const res = await fetch(
      `https://api.deepgram.com/v1/listen${queryString}`,
      fetchOptions
    );
    console.log(isTranscribing, 'transcribe');

    const { metadata, results } = await res.json();
    if (results) {
      resultRef.current.push({ metadata, results });
      setIsTranscribing(false);
      let transcript;
      if (results['channels'][0]['alternatives'][0]['paragraphs']) {
        transcript =
          results['channels'][0]['alternatives'][0]['paragraphs']['transcript'];
        setIsTranscribing(false);
      } else {
        transcript = results['channels'][0]['alternatives'][0]['transcript'];
        setIsTranscribing(false);
      }

      setTranscript(transcript);
    } else {
      alert(
        'Received an empty result from the backend. Please check your input source'
      );
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="audio-select">
      <div className="upload-container">
        <div>
          <label> Upload your file here</label>

          {!isVisible ? (
            <label
              className={`UploadButton ${isVisible ? 'visible' : 'hidden'}`}
            >
              {' '}
              Upload File
              <input type="file" onChange={handleFileChange} />
            </label>
          ) : (
            <input
              className="URLInput"
              type="text"
              placeholder="www.example.com/sample.wav"
              onChange={handleTextChange}
            ></input>
          )}
          {!isVisible ? (
            <button onClick={toggleVisibility} className="url-text">
              URL upload instead
            </button>
          ) : (
            <button onClick={toggleVisibility} className="url-text">
              File upload instead
            </button>
          )}
        </div>
      </div>
      <div className="transcribe-button-container">
        <div>
          <label className="transcribe-label"> Upload your file here</label>
          <button
            className="PrimaryButton transcribe-button"
            onClick={handleTranscribe}
          >
            Transcribe
          </button>
          <button className="clear-button" onClick={handleClearText}>
            {' '}
            Clear{' '}
          </button>
          {isTranscribing ? (
            <ul className="wave-container">
              {waves.map((index) => (
                <li className="wave" key={index}></li>
              ))}
            </ul>
          ) : (
            <ul className="wave-container">
              {waves.map((index) => (
                <li className="wave empty-waves" key={index}></li>
              ))}
            </ul>
          )}
        </div>
        <div>{isTranscribing}</div>
      </div>
    </div>
  );
};
