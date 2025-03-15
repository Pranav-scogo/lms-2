export interface SubSection {
  id: string
  title: string
  content: string
  completed: boolean
  key_concepts?: string[]
  learning_objectives?: string[]
}

export interface Chapter {
  id: string
  title: string
  description: string
  subsections: SubSection[]
  quiz: {
    id: string
    questions: {
      id: number
      question: string
      options: string[]
      correctAnswer: number
      explanation?: string
    }[]
  }
  progress: number
}

export interface FinalQuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  related_modules?: string[]
}

export interface Course {
  id: string
  title: string
  description: string
  chapters: Chapter[]
  totalProgress: number
  final_quiz?: FinalQuizQuestion[]
}

