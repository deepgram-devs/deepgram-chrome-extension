import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const formatTranscription = (data: any, options: any) : string => {
    let result = data.channel.alternatives[0];
    if (options.diarize === "true") {
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
        if (transcript) {
          if (".?!".includes(transcript.slice(-1))) transcript += "\n";
          else transcript += " ";
        }
        
        return transcript;
    }
}

// modified from https://github.com/deepgram/deepgram-node-sdk/
export const toWebVTT = (results : Array<any>, lineLength = 8) : string => {
    if (results.length === 0) return "";
    const lastWords = results[results.length - 1]["channel"]["alternatives"][0]["words"];
    const lines: string[] = [];
    lines.push("WEBVTT");
    lines.push("");
    lines.push("NOTE");
    lines.push("Transcription provided by Deepgram");
    lines.push(`Request Id: ${results[0]["metadata"]["request_id"]}`);
    lines.push(`Created: ${new Date().toISOString()}`);
    lines.push(`Duration: ${lastWords[lastWords.length - 1]["end"]}`);
    lines.push(`Channels: ${results[0]["channel_index"].length}`);
    lines.push("");

    results.forEach(result => {
        const wordChunks = chunk(result["channel"]["alternatives"][0]["words"], lineLength);
        const limitedLines : string[] = [];

        wordChunks.forEach((words) => {
            const firstWord = words[0];
            const lastWord = words[words.length - 1];

            limitedLines.push(
                `${secondsToTimestamp(firstWord.start)} --> ${secondsToTimestamp(
                  lastWord.end
                )}`
              );
              limitedLines.push(
                words.map((word) => word.punctuated_word ?? word.word).join(" ")
              );
              limitedLines.push("");
        })

        lines.push(limitedLines.join("\n"));
    });

    return lines.join("\n");
}

export const toSTT = (results : Array<any>, lineLength = 8) : string => {
  if (results.length === 0) return "";
    
    const lines: string[] = [];

    let entry = 1;
    results.forEach(result => {
        const wordChunks = chunk(result["channel"]["alternatives"][0]["words"], lineLength);
        const limitedLines : string[] = [];

        wordChunks.forEach((words) => {
            const firstWord = words[0];
            const lastWord = words[words.length - 1];

            limitedLines.push((entry++).toString());
            limitedLines.push(
              `${secondsToTimestamp(
                firstWord.start,
                "HH:mm:ss,SSS"
              )} --> ${secondsToTimestamp(
                lastWord.end, 
                "HH:mm:ss,SSS")}`
            );
            limitedLines.push(
              words.map((word) => word.punctuated_word ?? word.word).join(" ")
            );
            limitedLines.push("");
        })

        lines.push(limitedLines.join("\n"));
    });

    return lines.join("\n");
}

const chunk = (arr: any[], length: number) => {
    if (arr) {
      const res: any[] = [];

      for (let i = 0; i < arr.length; i += length) {
        const chunkarr = arr.slice(i, i + length);
        res.push(chunkarr);
      }

      return res;
    } else {
      return [];
    }
};

const secondsToTimestamp = (
    seconds: number,
    format = "HH:mm:ss.SSS"): string => {
        return dayjs(seconds * 1000)
        .utc()
        .format(format);
}