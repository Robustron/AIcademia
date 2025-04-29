
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import SubjectCard from "@/components/SubjectCard";
import { Subject } from "@/lib/types";
import { generateSubjectSuggestions } from "@/lib/geminiClient";
import { Loader, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [recentSubjects, setRecentSubjects] = useState<Subject[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch subjects from database
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data, error } = await supabase
          .from('subjects')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          setRecentSubjects(data);
        }
      } catch (error: any) {
        console.error('Error fetching subjects:', error);
        toast({
          title: "Error",
          description: "Failed to load subjects",
          variant: "destructive",
        });
      }
    };
    
    fetchSubjects();
  }, [toast]);

  // Fetch user progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('subject_id, current_prompt')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (data) {
          const progressMap: Record<string, number> = {};
          data.forEach(item => {
            progressMap[item.subject_id] = item.current_prompt;
          });
          setUserProgress(progressMap);
        }
      } catch (error: any) {
        console.error('Error fetching user progress:', error);
      }
    };
    
    fetchUserProgress();
  }, [user]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    setSearching(true);
    try {
      const suggestions = await generateSubjectSuggestions(searchInput);
      setSubjects(suggestions);
    } catch (error) {
      console.error("Error fetching subject suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to generate subject suggestions",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Your Learning Dashboard</h1>
        
        {/* Search Section */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>What would you like to learn?</CardTitle>
            <CardDescription>
              Enter a subject area and we'll suggest specific topics for your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Example: Physics, Programming, Psychology..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={searching}>
                {searching ? (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Search Results */}
        {subjects.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Suggested Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <SubjectCard 
                  key={subject.id} 
                  subject={subject}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Recent Subjects */}
        {recentSubjects.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentSubjects.map((subject) => (
                <SubjectCard 
                  key={subject.id} 
                  subject={subject} 
                  progress={userProgress[subject.id] || 0}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
