import type { ProcessOutputSchema } from "@fusebox/api/schemas/process.schema";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Button } from "@web/components/ui/button";
import { useActiveProcessOutput } from "@web/store";
import { AnsiUp } from "ansi_up";
import { useEffect, useRef, useState } from "react";

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

const ansiUp = new AnsiUp();
ansiUp.escape_html = false;

export type StreamDisplayProps = {
  output: ProcessOutputSchema[];
};

export const StreamDisplay = () => {
  const activeProcessOutput = useActiveProcessOutput();

  const containerRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to run it on every output change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [activeProcessOutput]);

  return (
    <div ref={containerRef} className="bg-secondary p-2 border rounded-md h-full overflow-auto">
      {activeProcessOutput.map((line) => (
        <StreamDisplayLine key={line.number} line={line} />
      ))}
    </div>
  );
};

const StreamDisplayLine = ({ line }: { line: ProcessOutputSchema }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="flex gap-6 text-sm" key={line.number}>
      <div className="group shrink-0 w-8 text-gray-400">
        <div className="flex justify-end items-center relative">
          <div className="tabular-nums group-hover:opacity-0 transition-opacity duration-200">
            {line.number}
          </div>
          <div className="flex gap-1 opacity-0 absolute bg-secondary group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="size-4"
              onClick={() => handleCopy(line.line)}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>
        </div>
      </div>
      <p
        className="font-mono whitespace-pre"
        // biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: data comes validated from backend
        // biome-ignore lint/security/noDangerouslySetInnerHtml: data comes validated from backend
        dangerouslySetInnerHTML={{ __html: renderLine(line.line) }}
      />
    </div>
  );
};

const renderLine = (text: string) => {
  const parts = text.split(URL_REGEX);

  return parts
    .map((part) => {
      if (part.match(URL_REGEX)) {
        return `<a href="${part}" target="_blank" rel="noopener noreferrer" class="hover:underline">${part}</a>`;
      }
      return ansiUp.ansi_to_html(part);
    })
    .join("");
};
