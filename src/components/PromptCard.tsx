
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Prompt } from "@/lib/types";
import { Lightbulb } from "lucide-react";
import EaseItPopup from "./EaseItPopup";
import DiagramRenderer from "./DiagramRenderer";

interface PromptCardProps {
  prompt: Prompt;
  onSaveNote: (promptNumber: number, note: string) => void;
  savedNote?: string;
}

const PromptCard = ({ prompt, onSaveNote, savedNote }: PromptCardProps) => {
  const [note, setNote] = useState(savedNote || "");
  const [showEaseIt, setShowEaseIt] = useState(false);

  const handleSaveNote = () => {
    onSaveNote(prompt.number, note);
  };

  return (
    <Card className="prompt-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{prompt.title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setShowEaseIt(true)}
            className="hover:bg-yellow-100 hover:text-amber-600 text-muted-foreground">
            <Lightbulb className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium">Concept Explanation</h3>
          <p className="text-muted-foreground">{prompt.conceptExplanation}</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Real-World Examples</h3>
          <p className="text-muted-foreground">{prompt.realWorldExamples}</p>
        </div>
        
        {prompt.caseStudies && (
          <div className="space-y-2">
            <h3 className="font-medium">Case Studies</h3>
            <p className="text-muted-foreground">{prompt.caseStudies}</p>
          </div>
        )}

        {prompt.diagramCode && (
          <div className="space-y-2">
            <h3 className="font-medium">Diagram</h3>
            <DiagramRenderer code={prompt.diagramCode} />
          </div>
        )}
        
        {prompt.task && (
          <div className="space-y-2">
            <h3 className="font-medium">Your Task</h3>
            <p className="text-muted-foreground">{prompt.task}</p>
            
            <div className="pt-2">
              <Textarea
                placeholder="Write your reflections here..."
                className="min-h-[100px]"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
      
      {prompt.task && (
        <CardFooter>
          <Button onClick={handleSaveNote} className="ml-auto">
            Save Note
          </Button>
        </CardFooter>
      )}
      
      {showEaseIt && (
        <EaseItPopup prompt={prompt} onClose={() => setShowEaseIt(false)} />
      )}
    </Card>
  );
};

export default PromptCard;
