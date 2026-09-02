"use client";

import { useLayoutEffect, useRef, useState } from "react";

type OverviewTextProps = {
  text: string;
};

const OverviewText = ({ text }: OverviewTextProps) => {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el || expanded) return;
    setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [text, expanded]);

  if (!text) return null;

  return (
    <div>
      <p
        ref={textRef}
        className={`text-sm leading-relaxed text-muted-foreground sm:text-base ${
          expanded ? "" : "line-clamp-5 sm:line-clamp-3"
        }`}
      >
        {text}
      </p>
      {overflows && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-1 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default OverviewText;
