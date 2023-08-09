export const formatTranscription = (data: any, options: any) : string => {
    console.log("options: ", options);
    let result = data.channel.alternatives[0];
    if (options.diarize) {
        let speakers = {};
        result.words.forEach(wordBase => {
            let {speaker, word} = wordBase;
            speaker = speaker.toString();
            if (speakers[speaker]) {
                speakers[speaker] += (" " + word);
            } else {
                speakers[speaker] = word;
            }
        });
        
        let transcript = "";
        for (const speaker in speakers) {
            transcript += ("[Speaker " + speaker + "] " + speakers[speaker] + "\n");
        }
        return transcript;
    } else {
        let transcript = result.transcript;
        if (".?!".includes(transcript.slice(-1))) transcript += "\n";
        return transcript;
    }
}

export const toWebVTT = (results : Array<any>) : string => {
    if (results.length === 0) return "";

    const lines: string[] = [];
    lines.push("WEBVTT");
    lines.push("");
    lines.push("NOTE");
    lines.push("Transcription provided by Deepgram");
    lines.push(`Request Id: `);
    lines.push(`Created: `);
    lines.push(`Duration: `);
    lines.push(`Channels: `);
    lines.push("");

    return lines.join("\n");    
  }
