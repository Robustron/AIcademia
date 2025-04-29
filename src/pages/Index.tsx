
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ArrowRight, BookOpen, Lightbulb, Book } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="container py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight gradient-heading mb-6 animate-fade-in">
            Learn Anything with AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10 animate-fade-in delay-100">
            Master any subject through a structured 100-prompt journey 
            with personalized AI guidance and interactive learning.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in delay-200">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8 gap-2">
                  Start Learning <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 gap-2">
                  Sign Up Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Button size="lg" variant="outline" className="text-lg">
              Learn More
            </Button>
          </div>
        </section>
        
        {/* Features section */}
        <section className="bg-muted/50 py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How AI University Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm border animate-fade-in">
                <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">100 Prompt Journey</h3>
                <p className="text-muted-foreground">
                  Follow a structured learning path with 100 carefully designed prompts 
                  that build your knowledge from foundations to mastery.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm border animate-fade-in delay-100">
                <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">AI Assistance</h3>
                <p className="text-muted-foreground">
                  Stuck on a complex concept? Use the "Ease It" feature to get 
                  simplified explanations and helpful analogies.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm border animate-fade-in delay-200">
                <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Track Progress</h3>
                <p className="text-muted-foreground">
                  Earn certificates at key milestones and track your learning journey. 
                  Create a custom textbook when you complete all 100 prompts.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="container py-20">
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose from thousands of subjects and begin your learning journey today.
            </p>
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Book className="h-5 w-5 text-primary" />
            <span className="font-bold">AI University</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI University. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
