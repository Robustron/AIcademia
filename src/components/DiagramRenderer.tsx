
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface DiagramRendererProps {
  code: string;
}

const DiagramRenderer = ({ code }: DiagramRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = `diagram-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
    });
    
    if (containerRef.current) {
      try {
        mermaid.render(uniqueId, code).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        });
      } catch (error) {
        console.error("Error rendering diagram:", error);
        if (containerRef.current) {
          containerRef.current.innerHTML = '<div class="p-4 text-red-500">Error rendering diagram</div>';
        }
      }
    }
  }, [code, uniqueId]);

  return (
    <div className="overflow-auto border rounded-md p-4 bg-white">
      <div ref={containerRef} className="flex justify-center" />
    </div>
  );
};

export default DiagramRenderer;
