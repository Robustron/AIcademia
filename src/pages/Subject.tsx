
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import PromptCard from "@/components/PromptCard";
import ProgressBar from "@/components/ProgressBar";
import MilestoneCertificate from "@/components/MilestoneCertificate";
import { Prompt, MilestoneData, Quiz } from "@/lib/types";
import { getPrompt, getQuiz } from "@/lib/geminiClient";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";

const Subject = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [currentPrompt, setCurrentPrompt] = useState<number>(1);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneData, setMilestoneData] = useState<MilestoneData | null>(null);
  
  // Get the subject name from the ID for display
  const subjectName = subjectId ? 
    subjectId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 
    '';
  
  useEffect(() => {
    const loadPrompt = async () => {
      if (!subjectId) return;
      
      setLoading(true);
      try {
        // Check if we need to show a quiz (every 10th prompt)
        if (currentPrompt % 10 === 0) {
          const quizData = await getQuiz(subjectId, [currentPrompt - 9, currentPrompt]);
          setQuiz(quizData);
          setShowQuiz(true);
        } else {
          setShowQuiz(false);
        }
        
        // Fetch the prompt data
        const promptData = await getPrompt(subjectId, currentPrompt);
        setPrompt(promptData);
        
        // Check if we hit a milestone
        if ([25, 50, 75, 100].includes(currentPrompt)) {
          const milestone = currentPrompt as 25 | 50 | 75 | 100;
          const titles = {
            25: "Quick Learner",
            50: "Halfway Hero",
            75: "Almost There",
            100: "Subject Master"
          };
          const descriptions = {
            25: "You've completed 25% of the journey. Keep going!",
            50: "Halfway through! You've built a solid foundation.",
            75: "75% complete. You're becoming an expert!",
            100: "Congratulations! You've mastered this subject!"
          };
          
          setMilestoneData({
            level: milestone,
            title: titles[milestone],
            description: descriptions[milestone],
            subject: subjectName,
            username: "Student", // In a real app, get from Supabase auth
            date: new Date()
          });
          setShowMilestone(true);
        }
      } catch (error) {
        console.error("Error loading prompt:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPrompt();
  }, [currentPrompt, subjectId, subjectName]);
  
  const handlePrevious = () => {
    if (currentPrompt > 1) {
      setCurrentPrompt(currentPrompt - 1);
    }
  };
  
  const handleNext = () => {
    if (currentPrompt < 100) {
      setCurrentPrompt(currentPrompt + 1);
    }
  };
  
  const handleSaveNote = (promptNumber: number, note: string) => {
    setNotes({
      ...notes,
      [promptNumber]: note
    });
    // In a real app, save to Supabase here
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{subjectName}</h1>
            <p className="text-muted-foreground">Your personalized learning journey</p>
          </div>
        </div>
        
        <ProgressBar current={currentPrompt} total={100} className="mb-8" />
        
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {prompt && !showQuiz && (
              <PromptCard
                prompt={prompt}
                onSaveNote={handleSaveNote}
                savedNote={notes[currentPrompt]}
              />
            )}
            
            {showQuiz && quiz && (
              <div className="card p-6 border rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Review & Quiz</h2>
                <p className="mb-6">Let's check your understanding of the last few prompts:</p>
                
                <div className="space-y-8">
                  {quiz.questions.map((question, index) => (
                    <div key={index} className="space-y-4">
                      <h3 className="font-medium">Question {index + 1}: {question.question}</h3>
                      
                      {question.type === 'multiple-choice' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center">
                              <input
                                type="radio"
                                name={`question-${index}`}
                                id={`q${index}-opt${optIndex}`}
                                className="mr-2"
                              />
                              <label htmlFor={`q${index}-opt${optIndex}`}>
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'short-answer' && (
                        <textarea
                          className="w-full p-3 border rounded-md h-24"
                          placeholder="Write your answer here..."
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <Button onClick={() => setShowQuiz(false)}>Submit Quiz & Continue</Button>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentPrompt <= 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              
              <span className="text-muted-foreground">
                Prompt {currentPrompt} of 100
              </span>
              
              <Button
                onClick={handleNext}
                disabled={currentPrompt >= 100}
                className="gap-2"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </main>
      
      {showMilestone && milestoneData && (
        <MilestoneCertificate
          data={milestoneData}
          open={showMilestone}
          onClose={() => setShowMilestone(false)}
        />
      )}
    </div>
  );
};

export default Subject;
