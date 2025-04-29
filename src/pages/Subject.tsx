
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import PromptCard from "@/components/PromptCard";
import ProgressBar from "@/components/ProgressBar";
import MilestoneCertificate from "@/components/MilestoneCertificate";
import { Prompt, MilestoneData, Quiz } from "@/lib/types";
import { getPrompt, getQuiz } from "@/lib/geminiClient";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Subject = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [currentPrompt, setCurrentPrompt] = useState<number>(1);
  const [subject, setSubject] = useState<{ name: string, description: string, prompt_count: number } | null>(null);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneData, setMilestoneData] = useState<MilestoneData | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get subject information
  useEffect(() => {
    const fetchSubject = async () => {
      if (!subjectId) return;
      
      try {
        const { data, error } = await supabase
          .from('subjects')
          .select('name, description, prompt_count')
          .eq('id', subjectId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setSubject(data);
        }
      } catch (error: any) {
        console.error('Error fetching subject:', error);
        toast({
          title: "Error",
          description: "Failed to load subject information",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    };
    
    fetchSubject();
  }, [subjectId, toast, navigate]);
  
  // Get user progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!subjectId || !user) return;
      
      try {
        // Check if user has progress for this subject
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('current_prompt, notes')
          .eq('user_id', user.id)
          .eq('subject_id', subjectId)
          .single();
        
        if (progressError && progressError.code !== 'PGRST116') { // PGRST116 = not found
          throw progressError;
        }
        
        if (progressData) {
          // If user has existing progress, set current prompt and notes
          setCurrentPrompt(progressData.current_prompt);
          if (progressData.notes) {
            // Convert JSON object from Supabase to Record<number, string>
            const notesData: Record<number, string> = {};
            const notesObj = progressData.notes as Record<string, string>;
            
            // Convert string keys to numbers for our expected format
            Object.keys(notesObj).forEach(key => {
              const numericKey = parseInt(key, 10);
              if (!isNaN(numericKey)) {
                notesData[numericKey] = notesObj[key];
              }
            });
            
            setNotes(notesData);
          }
        } else {
          // If no progress exists, create a new record
          const { error: insertError } = await supabase
            .from('user_progress')
            .insert({
              user_id: user.id,
              subject_id: subjectId,
              current_prompt: 1
            });
          
          if (insertError) throw insertError;
        }
      } catch (error: any) {
        console.error('Error loading or creating user progress:', error);
      }
    };
    
    fetchUserProgress();
  }, [subjectId, user]);
  
  useEffect(() => {
    const loadPrompt = async () => {
      if (!subjectId || !subject) return;
      
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
            subject: subject.name,
            username: user?.email?.split('@')[0] || "Student",
            date: new Date()
          });
          setShowMilestone(true);
        }
        
        // Update user progress in database
        if (user) {
          await supabase
            .from('user_progress')
            .update({
              current_prompt: currentPrompt,
              last_updated: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('subject_id', subjectId);
        }
      } catch (error) {
        console.error("Error loading prompt:", error);
        toast({
          title: "Error",
          description: "Failed to load learning content",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPrompt();
  }, [currentPrompt, subjectId, subject, user, toast]);
  
  const handlePrevious = () => {
    if (currentPrompt > 1) {
      setCurrentPrompt(currentPrompt - 1);
    }
  };
  
  const handleNext = () => {
    if (subject && currentPrompt < subject.prompt_count) {
      setCurrentPrompt(currentPrompt + 1);
    }
  };
  
  const handleSaveNote = async (promptNumber: number, note: string) => {
    const updatedNotes = {
      ...notes,
      [promptNumber]: note
    };
    
    setNotes(updatedNotes);
    
    // Save to database
    if (user && subjectId) {
      try {
        await supabase
          .from('user_progress')
          .update({
            notes: updatedNotes
          })
          .eq('user_id', user.id)
          .eq('subject_id', subjectId);
          
        toast({
          title: "Note saved",
          description: "Your note has been saved successfully",
        });
      } catch (error) {
        console.error('Error saving note:', error);
        toast({
          title: "Error",
          description: "Failed to save note",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleQuizSubmit = async (score: number) => {
    setShowQuiz(false);
    
    // Save quiz score to database
    if (user && subjectId) {
      try {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('quiz_scores')
          .eq('user_id', user.id)
          .eq('subject_id', subjectId)
          .single();
        
        const quizScores = progressData?.quiz_scores || {};
        quizScores[currentPrompt / 10] = score;
        
        await supabase
          .from('user_progress')
          .update({
            quiz_scores: quizScores
          })
          .eq('user_id', user.id)
          .eq('subject_id', subjectId);
      } catch (error) {
        console.error('Error saving quiz score:', error);
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{subject?.name || subjectId}</h1>
            <p className="text-muted-foreground">{subject?.description || 'Your personalized learning journey'}</p>
          </div>
        </div>
        
        <ProgressBar 
          current={currentPrompt} 
          total={subject?.prompt_count || 100} 
          className="mb-8" 
        />
        
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
                  <Button onClick={() => handleQuizSubmit(85)}>Submit Quiz & Continue</Button>
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
                Prompt {currentPrompt} of {subject?.prompt_count || 100}
              </span>
              
              <Button
                onClick={handleNext}
                disabled={subject ? currentPrompt >= subject.prompt_count : currentPrompt >= 100}
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
