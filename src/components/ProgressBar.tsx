
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

const ProgressBar = ({ current, total, className }: ProgressBarProps) => {
  const percentage = Math.round((current / total) * 100);
  
  // Determine milestone levels
  const isMilestone25 = current >= 25 && current < 50;
  const isMilestone50 = current >= 50 && current < 75;
  const isMilestone75 = current >= 75 && current < 100;
  const isMilestone100 = current === 100;
  
  const milestoneColor = 
    isMilestone100 ? "bg-gradient-to-r from-primary to-secondary" :
    isMilestone75 ? "bg-secondary" :
    isMilestone50 ? "bg-primary" :
    "bg-primary/70";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span className="text-primary font-medium">{current}/{total} prompts</span>
      </div>
      <Progress value={percentage} className="h-2" indicatorClassName={milestoneColor} />
      
      {/* Milestone markers */}
      <div className="relative h-0">
        {[25, 50, 75, 100].map(milestone => (
          <div
            key={milestone}
            className={cn(
              "absolute top-[-18px] transform -translate-x-1/2",
              "w-3 h-3 rounded-full border-2 border-background",
              current >= milestone ? "bg-primary" : "bg-muted",
            )}
            style={{ left: `${milestone}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
