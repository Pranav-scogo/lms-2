export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ModuleQuizQuestion extends QuizQuestion {
  // This extends the base quiz question
}

export interface FinalQuizQuestion extends QuizQuestion {
  related_modules: string[];  // Additional field for final quiz questions
}

export interface LearningModule {
  module_name: string;
  key_concepts: string[];
  learning_objectives: string[];
  content_summary: string;
  section_quiz: ModuleQuizQuestion[];
}

export interface ProcessPdfResponse {
  modules: LearningModule[];
  comprehensive_summary: string;
  final_quiz: FinalQuizQuestion[];
} 