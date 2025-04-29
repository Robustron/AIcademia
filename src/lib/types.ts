
export interface User {
  id: string;
  email: string;
  username?: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  promptCount: number;
}

export interface UserProgress {
  userId: string;
  subjectId: string;
  currentPrompt: number;
  notes: Record<number, string>;
  quizScores: Record<number, number>;
  lastUpdated: Date;
}

export interface Prompt {
  number: number;
  title: string;
  conceptExplanation: string;
  realWorldExamples: string;
  caseStudies?: string;
  task?: string;
  diagramCode?: string;
}

export interface Quiz {
  promptNumber: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options?: string[];
  correctAnswerIndex?: number;
  type: 'multiple-choice' | 'short-answer';
}

export interface MilestoneData {
  level: 25 | 50 | 75 | 100;
  title: string;
  description: string;
  subject: string;
  username: string;
  date: Date;
}

export interface EaseItResponse {
  analogy: string;
  simplifiedExplanation: string;
}
