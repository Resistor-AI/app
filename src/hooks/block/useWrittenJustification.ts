import { useState, useCallback, useRef, useMemo } from "react";
import { validateJustification } from "@/src/lib/focus/friction/validateJustification";

export function useWrittenJustification() {
  const [text, setText] = useState("");
  const prevLength = useRef(0);

  const handleChange = useCallback((newText: string) => {
    const delta = newText.length - prevLength.current;
    // Anti-paste: reject if more than 2 chars added at once
    if (delta > 2) return;
    prevLength.current = newText.length;
    setText(newText);
  }, []);

  const validation = useMemo(() => validateJustification(text), [text]);
  const charCount = text.length;

  return {
    text,
    handleChange,
    charCount,
    isValid: validation.valid,
    validationMessage: validation.message,
  };
}
