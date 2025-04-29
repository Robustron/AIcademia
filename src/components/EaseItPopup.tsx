
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Prompt, EaseItResponse } from "@/lib/types";
import { getEaseItExplanation } from "@/lib/geminiClient";
import { Loader } from "lucide-react";

interface EaseItPopupProps {
  prompt: Prompt;
  onClose: () => void;
}

const EaseItPopup = ({ prompt, onClose }: EaseItPopupProps) => {
  const [explanation, setExplanation] = useState<EaseItResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExplanation = async () => {
      try {
        const data = await getEaseItExplanation(prompt);
        setExplanation(data);
      } catch (error) {
        console.error("Error fetching explanation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [prompt]);

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Simplified Explanation</DialogTitle>
          <DialogDescription>
            A more accessible explanation of this concept
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <h3 className="font-medium mb-2">Analogy</h3>
              <p>{explanation?.analogy}</p>
            </Card>
            
            <div>
              <h3 className="font-medium mb-2">Simplified Explanation</h3>
              <p>{explanation?.simplifiedExplanation}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EaseItPopup;
