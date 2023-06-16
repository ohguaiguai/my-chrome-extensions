import React, { useCallback, useEffect, useState } from "react";
import { ContentEvalService } from "@src/services/content/ContentEvalService";
import { DocsVoiceInputContentService } from "@src/services/docs/voiceInput/DocsVoiceInputContentService";
import { Service } from "@src/services/Service";
import { ReactComponent as IconRecord } from "@assets/img/icon-record.svg";

const insertText = (text: string) => {
  Service.getInstance(ContentEvalService).eval(
    `window.Docs.Word.editor.insertText(${JSON.stringify(text)})`,
  );
};

let recording = false;
let to: ReturnType<typeof setTimeout> | null = null;
let startTimeout = 20 * 1000;
let speechTimeout = 10 * 1000;
let clean: null | (() => void) = null;

const handleVisibilityChange = () => {
  if (document.visibilityState !== "visible") {
    clean?.();
  }
};

const useVoiceInput = (
  onResult: (
    results: {
      isFinal: boolean;
      transcript: string;
    }[],
  ) => void,
) => {
  const [isRecording, setIsRecording] = useState(recording);

  useEffect(() => {
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
      false,
    );
    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
        false,
      );

      clean?.();
    };
  }, []);

  const fn = useCallback(() => {
    if (recording) {
      clean?.();
      return;
    }

    let stop: null | (() => void) = null;

    const doClean = () => {
      if (to) {
        clearTimeout(to);
      }
      recording = false;
      clean = null;
      stop?.();
      setIsRecording(false);
    };

    const delayClean = (timeout: number) => {
      if (timeout === -1) {
        if (to) {
          clearTimeout(to);
        }
        return;
      }
      to = setTimeout(doClean, timeout);
    };

    clean = doClean;

    const ret = Service.getInstance(DocsVoiceInputContentService).startInput({
      onStart() {
        console.log("vi.onStart");
        recording = true;
        setIsRecording(true);

        delayClean(startTimeout);
      },
      onSpeechStart() {
        console.log("vi.onSpeechStart");

        delayClean(-1);
      },
      onSpeechEnd() {
        console.log("vi.onSpeechEnd");

        delayClean(speechTimeout);
      },
      onResult(results) {
        console.log("vi.onResult");

        delayClean(-1);
        onResult(results);
      },
      onEnd() {
        console.log("vi.onEnd");

        doClean();
      },
    });
    stop = ret.stop;
  }, []);

  return [isRecording, fn] as const;
};

const style = { width: "32px", height: "32px", transform: "scale(1)" };
const styleRecording = {
  ...style,
  color: "red",
  animation: "docsFanRipple 1s infinite",
};

export const VoiceInput = () => {
  const [isRecording, startRecording] = useVoiceInput((results) => {
    results.forEach(({ isFinal, transcript }) => {
      if (isFinal) {
        insertText(transcript);
      }
    });
  });

  return (
    <>
      <IconRecord
        onClick={startRecording}
        style={isRecording ? styleRecording : style}
      />
      <style>
        {`
@keyframes docsFanRipple {
    0% {
        transform: scale(1)
    }
    30% {
        transform: scale(1.2)
    }
    60% {
        transform: scale(1)
    }
    100% {
        transform: scale(1)
    }
}`}
      </style>
    </>
  );
};
