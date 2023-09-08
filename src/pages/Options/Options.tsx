import React, { useEffect, useState } from 'react';
import './Options.css';
import Steve from '../../assets/img/steve.svg';

const livestreamQueryParams = [
  {
    label: 'Model',
    key: 'model',
    options: ['general', 'meeting', 'phonecall', ''],
  },
  { label: 'Tier', key: 'tier', options: ['', 'enhanced', 'base'] },
  {
    label: 'Languages',
    key: 'language',
    options: [
      '',
      'da',
      'en',
      'en-AU',
      'en-GB',
      'en-IN',
      'en-NZ',
      'en-US',
      'es',
      'es-419',
      'fr',
      'fr-CA',
      'hi',
      'hi-Latn',
      'id',
      'it',
      'ja',
      'ko',
      'nl',
      'pl',
      'pt',
      'pt-PT',
      'pt-BR',
      'ru',
      'sv',
      'tr',
      'uk',
      'zh-CN',
      'zh-TW',
    ],
  },
  { label: 'Punctuate', key: 'punctuate', options: ['', 'true', 'false'] },
  {
    label: 'Profanity Filter',
    key: 'profanity_filter',
    options: ['', 'true', 'false'],
  },
  { label: 'Diarize', key: 'diarize', options: ['', 'true', 'false'] },
  {
    label: 'Smart Format',
    key: 'smart_format',
    options: ['', 'true', 'false'],
  },
  {
    label: 'Filler Words',
    key: 'filler_words',
    options: ['', 'true', 'false'],
  },
  { label: 'Numerals', key: 'numerals', options: ['', 'true', 'false'] },
  {
    label: 'Interim Results',
    key: 'interim_results',
    options: ['', 'true', 'false'],
  },
];

const prerecordedQueryParams = [
  {
    label: 'Model',
    key: 'model',
    options: [
      'general',
      'meeting',
      'phonecall',
      'voicemail',
      'finance',
      'conversationalai',
      'video',
      'whisper',
      '',
    ],
  },
  { label: 'Tier', key: 'tier', options: ['', 'nova', 'enhanced', 'base'] },
  {
    label: 'Languages',
    key: 'language',
    options: [
      '',
      'da',
      'en',
      'en-AU',
      'en-GB',
      'en-IN',
      'en-NZ',
      'en-US',
      'es',
      'es-419',
      'fr',
      'fr-CA',
      'hi',
      'hi-Latn',
      'id',
      'it',
      'ja',
      'ko',
      'nl',
      'pl',
      'pt',
      'pt-PT',
      'pt-BR',
      'ru',
      'sv',
      'tr',
      'uk',
      'zh-CN',
      'zh-TW',
    ],
  },
  {
    label: 'Detect Language',
    key: 'detect_language',
    options: ['true', 'false', ''],
  },
  { label: 'Punctuate', key: 'punctuate', options: ['', 'true', 'false'] },
  {
    label: 'Profanity Filter',
    key: 'profanity_filter',
    options: ['', 'true', 'false'],
  },
  {
    label: 'Redact',
    key: 'redact',
    options: ['pci', 'numbers', 'ssn', 'true', 'false', ''],
  },
  { label: 'Diarize', key: 'diarize', options: ['', 'true', 'false'] },
  {
    label: 'Smart Format',
    key: 'smart_format',
    options: ['', 'true', 'false'],
  },
  {
    label: 'Filler Words',
    key: 'filler_words',
    options: ['', 'true', 'false'],
  },
  { label: 'Numerals', key: 'numerals', options: ['', 'true', 'false'] },
  { label: 'Utterances', key: 'utterances', options: ['', 'true', 'false'] },
  {
    label: 'Measurements',
    key: 'measurements',
    options: ['', 'true', 'false'],
  },
  { label: 'Dictation', key: 'dictation', options: ['', 'true', 'false'] },
];

const Options: React.FC = () => {
  const [prerecordedOptions, setPrerecordedOptions] = useState({});
  const [livestreamOptions, setLivestreamOptions] = useState({});

  useEffect(() => {
    chrome.storage.local.get('deepgramOptions').then((result) => {
      if (result && result.deepgramOptions) {
        const prerecordedOptions = result.deepgramOptions.prerecordedOptions;
        const livestreamOptions = result.deepgramOptions.livestreamOptions;
        if (prerecordedOptions) {
          setPrerecordedOptions(prerecordedOptions);
        }
        if (livestreamOptions) {
          setLivestreamOptions(livestreamOptions);
        }
      }
    });
  }, []);

  useEffect(() => {
    const options = {
      prerecordedOptions: prerecordedOptions,
      livestreamOptions: livestreamOptions,
    };

    chrome.storage.local.set({
      deepgramOptions: options,
    });
  }, [livestreamOptions, prerecordedOptions]);

  const handleDropdownChange = (option) => {
    return (event) => {
      if (option === 'livestream') {
        const newselectedOptions = { ...livestreamOptions };
        if (event.target.value) {
          newselectedOptions[event.target.name] = event.target.value;
        } else {
          delete newselectedOptions[event.target.name];
        }
        setLivestreamOptions(newselectedOptions);
      } else if (option === 'prerecorded') {
        const newselectedOptions = { ...prerecordedOptions };
        if (event.target.value) {
          newselectedOptions[event.target.name] = event.target.value;
        } else {
          delete newselectedOptions[event.target.name];
        }
        setPrerecordedOptions(newselectedOptions);
      }
    };
  };

  return (
    <div>
      <div className="title">
        <h1>Transcription Options</h1>
        <img className="steve" src={Steve} />
      </div>
      <p className="instructions">
        Configure the extension with your selected features. See the{' '}
        <a href="https://developers.deepgram.com/docs" target="blank">
          Deepgram documentation{' '}
        </a>
        for more information.
      </p>
      <div className="options-container">
        <div className="livestream-container">
          <h2>Livestream:</h2>
          {livestreamQueryParams.map((param, index) => (
            <div className="Row">
              <label>{param.label}</label>
              <select
                key={index}
                name={param.key}
                value={livestreamOptions[param.key] || ''}
                onChange={handleDropdownChange('livestream')}
              >
                {param.options.map((option, idx) => {
                  return (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}
        </div>
        <div className="prerecorded-container">
          <h2>Prerecorded:</h2>
          {prerecordedQueryParams.map((param, index) => (
            <div className="Row">
              <label>{param.label}</label>
              <select
                key={index}
                name={param.key}
                value={prerecordedOptions[param.key] || ''}
                onChange={handleDropdownChange('prerecorded')}
              >
                {param.options.map((option, idx) => {
                  return (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}
        </div>
      </div>
      {/* {prerecordedQueryParams.map((param, index) => (
        <div className="Row">
          <label>{param.label}</label>
          <select
            key={index}
            name={param.key}
            value={prerecordedOptions[param.key] || ''}
            onChange={handleDropdownChange('prerecorded')}
          >
            {param.options.map((option, idx) => {
              return (
                <option key={idx} value={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </div>
      ))} */}
    </div>
  );
};

export default Options;
