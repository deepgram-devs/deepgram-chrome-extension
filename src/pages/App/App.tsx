import React, { useEffect, useRef, useState } from 'react';
import { Header } from './Header';
import { LiveStreamControl } from './LiveStreamControl';
import { PrerecordedControl } from './PrerecordedControl';
import { Recorder } from './Recorder';
import { Container, Stack, Button, TextField } from '@mui/material';
import { toWebVTT, toSRT } from './utils';
import './App.css';

const App: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const resultRef = useRef([]);

  const [projects, setProjects] = useState([]);
  const [mode, setMode] = useState('livestream');
  const [selectedProject, setSelectedProject] = useState('');

  const tokenRef = useRef('');
  const modes = ['livestream', 'prerecorded'];

  useEffect(() => {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: 1,
          priority: 1,
          action: {
            type: 'modifyHeaders',
            requestHeaders: [
              {
                header: 'origin',
                operation: 'set',
                value: 'https://extension.deepgram.com',
              },
            ],
          },
          condition: {
            urlFilter: 'https://manage.deepgram.com',
            initiatorDomains: [chrome.runtime.id],
            resourceTypes: ['xmlhttprequest'],
          },
        },
      ],
      removeRuleIds: [1],
    });

    const getProjects = async () => {
      try {
        const res = await fetch(
          'https://manage.deepgram.com/v1/projects_with_scopes',
          { method: 'GET' }
        );
        var { projects } = await res.json();
        setProjects(projects);
        setSelectedProject(projects[0]['project_id']);
      } catch (error) {
        if (error) {
          alert('You have not login yet.');
        }
        return;
      }
    };

    getProjects();
  }, []);

  useEffect(() => {
    const getKey = async () => {
      const payload = {
        comment: 'auto generated api chrome extension key',
        dg_internal_tags: [],
        scopes: ['member'],
        time_to_live_in_seconds: 6000,
      };

      if (selectedProject) {
        try {
          const res = await fetch(
            `https://manage.deepgram.com/v1/projects/${selectedProject}/keys`,
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            }
          );
          const { key } = await res.json();
          tokenRef.current = key;
        } catch (error) {
          alert(
            'Cannot use this project. Please check your credits or choose another project.'
          );
        }
      }
    };

    getKey();
  }, [selectedProject]);

  const handleDownload = (e) => {
    let text: string = '';
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    switch (e.target.name) {
      case 'transcript':
        text = transcript;
        a.download = 'transcript.txt';
        break;
      case 'WebVTT':
        text = toWebVTT(resultRef.current);
        a.download = 'transcript.vtt';
        break;
      case 'SRT':
        text = toSRT(resultRef.current);
        a.download = 'transcript.srt';
        break;
      default:
        console.error('Unsupported option');
    }
    const file = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(file);
    a.href = url;
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  };

  const handleClearText = () => {
    setTranscript('');
    resultRef.current = [];
  };

  const input = (mode) => {
    switch (mode) {
      case 'livestream':
        return (
          <LiveStreamControl
            tokenRef={tokenRef}
            resultRef={resultRef}
            setTranscript={setTranscript}
            handleClearText={handleClearText}
          />
        );
      case 'prerecorded':
        return (
          <PrerecordedControl
            tokenRef={tokenRef}
            resultRef={resultRef}
            setTranscript={setTranscript}
            handleClearText={handleClearText}
          />
        );
      case 'recorder':
        return (
          <Recorder
            tokenRef={tokenRef}
            resultRef={resultRef}
            setTranscript={setTranscript}
            handleClearText={handleClearText}
          />
        );
    }
  };

  return (
    <Stack direction={'column'}>
      <Header
        projects={projects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        modes={modes}
        mode={mode}
        setMode={setMode}
      />

      <Container maxWidth="md">
        {input(mode)}

        <Stack direction={'row'} justifyContent={'space-around'}>
          <textarea
            readOnly
            className="Transcript"
            value={transcript}
            placeholder="Human click button, transcript will be forthcoming."
          ></textarea>
        </Stack>
      </Container>

      <Container maxWidth="md">
        <Stack direction={'row'} justifyContent={'space-around'}>
          <button
            className="SecondaryButton"
            name="transcript"
            onClick={handleDownload}
          >
            Download Transcript
          </button>
          <button
            name="SRT"
            className="SecondaryButton"
            onClick={handleDownload}
          >
            Download SRT
          </button>
          <button
            name="WebVTT"
            className="SecondaryButton"
            onClick={handleDownload}
          >
            Download WebVTT
          </button>
        </Stack>
      </Container>
    </Stack>
  );
};

export default App;
