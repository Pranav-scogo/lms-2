export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface CourseSection {
  page: number;
  summary: string;
  questions: QuizQuestion[];
}

export interface ProcessPdfResponse {
  sections: CourseSection[];
  final_summary: string;
  final_quiz: QuizQuestion[];
} 