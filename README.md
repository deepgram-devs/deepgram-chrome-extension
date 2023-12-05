# Deepgram Chrome Extension

This is the Deepgram Chrome Extension originally built by the Deepgram DX team. It allows users to try out Deepgram transcription, both prerecorded and live audio.

## How to use it

There are two main pages: livestreaming and prerecorded. There is also an options page for configuring out which features to use in the transcription.

### Livestreaming

A user can transcribe audio from the microphone, or they can toggle the microphone off and transcribe audio from a browser tab.

### Prerecorded

A user can upload an audio file from their computer or they can paste a URL of a hosted audio file.

### Options

This is where the user can select the different features (such as smart formatting, diarization, etc.)

## Running and installing the extension in dev mode

### Step 1: React project setup and run

1. Your Node version must be >= 18.
2. Clone the repository.
3. Type `npm install` to install the dependencies.
4. Type `npm run start` to spin up the dev server.
5. Type `npm run build` to create the build folder

### Step 2: Adding project to Chrome

1. Go to [chrome://extensions/](chrome://extensions/).
2. Toggle _Developer mode_ in the top right corner.
3. Click on _Load unpacked_.
4. Add the build folder for the project.
5. Now the project is loaded into your chrome extensions. Click on the puzzle piece icon to see all the extensions and you will see the Deepgram icon. Pin it if you wish.
6. Make sure the development server is running.
7. Click on extension icon to see it working. Now you can make updates and see them reload as you make them.
