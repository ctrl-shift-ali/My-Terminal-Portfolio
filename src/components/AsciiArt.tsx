import { useEffect, useRef, useState } from "react";

interface AsciiArtProps {
  content: string;
  className?: string;
  
  baseFontSize?: number;
  
  maxScale?: number;
}


export default function AsciiArt({
  content,
  className = "",
  baseFontSize = 8,
  maxScale = 1,
}: AsciiArtProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [scale, setScale] = useState(1);
  const [natural, setNatural] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    setNatural({ width: pre.scrollWidth, height: pre.scrollHeight });
  }, [content, baseFontSize]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || natural.width === 0) return;

    const recompute = () => {
      const containerWidth = container.clientWidth;
      if (!containerWidth) return;
      setScale(Math.min(containerWidth / natural.width, maxScale));
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(container);
    return () => ro.disconnect();
  }, [natural, maxScale]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height: natural.height ? natural.height * scale : undefined,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <pre
        ref={preRef}
        style={{
          margin: 0,
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          fontSize: `${baseFontSize}px`,
          lineHeight: 1,
          whiteSpace: "pre",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          color: "inherit",
        }}
      >
        {content}
      </pre>
    </div>
  );
}
