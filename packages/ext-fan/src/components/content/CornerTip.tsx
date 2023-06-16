import { CONFIG_VOICE_INPUT } from "@src/constants";
import { useConfig } from "@src/utils/useConfig";
import React from "react";
import { VoiceInput } from "./VoiceInput";

export const CornerTip = () => {
  const [enableVi] = useConfig(CONFIG_VOICE_INPUT, false);
  return enableVi ? <VoiceInput></VoiceInput> : null;
};
