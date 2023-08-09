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
