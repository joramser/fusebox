import type { ProcessOutputSchema } from "@fusebox/api/schemas/process.schema";
import { AnsiUp } from "ansi_up";
import { useEffect, useRef } from "react";

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

const ansiUp = new AnsiUp();
ansiUp.escape_html = false;

export type StreamDisplayProps = {
  output: ProcessOutputSchema[];
};

export const StreamDisplay = ({ output }: StreamDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to run it on every output change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div ref={containerRef} className="bg-secondary p-2 border rounded-md h-full overflow-auto">
      {output.map((line) => (
        <div className="flex gap-2 text-sm" key={line.number}>
          <span className="shrink-0 text-right w-8 text-gray-400 mr-4 tabular-nums">
            {line.number}
          </span>
          <p className="font-mono whitespace-pre">{renderLine(line.line)}</p>
        </div>
      ))}
    </div>
  );
};

const renderLine = (text: string) => {
  const parts = text.split(URL_REGEX);

  return parts.map((part) => {
    if (part.match(URL_REGEX)) {
      return (
        <a
          key={part}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {part}
        </a>
      );
    }
    return ansiUp.ansi_to_html(part);
  });
};
