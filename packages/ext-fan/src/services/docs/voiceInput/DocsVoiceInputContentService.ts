import { Service } from "@src/services/Service";

export class DocsVoiceInputContentService extends Service {
  recognition: any;

  startInput({
    onStart,
    onError,
    onEnd,
    onResult,
    onSpeechStart,
    onSpeechEnd,
  }: {
    onStart: () => void;
    onError?: () => void;
    onSpeechStart?: () => void;
    onSpeechEnd?: () => void;
    onEnd: () => void;
    onResult: (
      results: {
        isFinal: boolean;
        transcript: string;
      }[],
    ) => void;
  }) {
    const recognition =
      this.recognition || new (window as any).webkitSpeechRecognition();

    this.recognition = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    const clean = () => {
      recognition.onspeechstart = null;
      recognition.onspeechend = null;
      recognition.onstart = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.onresult = null;
    };

    recognition.onspeechstart = onSpeechStart;
    recognition.onspeechend = onSpeechEnd;

    recognition.onstart = onStart;

    recognition.onerror = (event: any) => {
      recognition.stop();

      clean();
      onError?.();
    };

    recognition.onend = onEnd;

    recognition.onresult = (event: any) => {
      console.log(event.results);
      if (typeof event.results == "undefined") {
        clean();
        recognition.stop();
        onEnd();
        return;
      }

      const results = [];

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        results.push({
          isFinal: item.isFinal,
          transcript: item[0].transcript,
        });
      }

      onResult(results);
    };

    recognition.lang = "cmn-Hans-CN";
    recognition.start();

    return {
      stop() {
        recognition.stop();
      },
    };
  }
}
