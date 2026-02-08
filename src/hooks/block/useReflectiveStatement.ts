import { useState, useMemo, useCallback, useRef } from "react";
import { FrictionContext } from "@/src/types/Block/index";

function buildTargetText(ctx: FrictionContext): string {
  if (ctx.mode === "end_session") {
    return (
      `I am choosing to quit ${ctx.taskName}. ` +
      `I am throwing away ${ctx.remainingMinutes} minutes of focus ` +
      `because I cannot stay committed. I know I will regret this.`
    );
  }
  return (
    `I am choosing ${ctx.appName} over ${ctx.taskName}. ` +
    `I am throwing away ${ctx.remainingMinutes} minutes of focus ` +
    `because I cannot resist this urge. I know I will regret this.`
  );
}

export function useReflectiveStatement(context: FrictionContext) {
  const targetText = useMemo(() => buildTargetText(context), [context]);
  const [typedText, setTypedText] = useState("");
  const prevLength = useRef(0);

  const handleTextChange = useCallback(
    (newText: string) => {
      const delta = newText.length - prevLength.current;

      // Anti-paste: reject if more than 2 chars added at once
      if (delta > 2) return;

      // Only allow characters that match the target at this position
      if (newText.length > typedText.length) {
        const nextChar = targetText[newText.length - 1];
        const typedChar = newText[newText.length - 1];
        if (typedChar !== nextChar) return;
      }

      prevLength.current = newText.length;
      setTypedText(newText);
    },
    [targetText, typedText],
  );

  const isComplete = typedText.length >= targetText.length;
  const progress = targetText.length > 0 ? typedText.length / targetText.length : 0;

  return { targetText, typedText, handleTextChange, isComplete, progress };
}
