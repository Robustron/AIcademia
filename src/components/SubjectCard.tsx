
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Subject } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface SubjectCardProps {
  subject: Subject;
  progress?: number;
}

const SubjectCard = ({ subject, progress }: SubjectCardProps) => {
  const isStarted = progress !== undefined && progress > 0;
  
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>{subject.name}</CardTitle>
        <CardDescription>{subject.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {isStarted ? (
          <div className="space-y-2">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${(progress / subject.promptCount) * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {progress} of {subject.promptCount} prompts completed
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {subject.promptCount} prompts
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Link to={`/subject/${subject.id}`} className="w-full">
          <Button className="w-full gap-2">
            {isStarted ? "Continue" : "Start Learning"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;
