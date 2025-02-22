export interface SubSection {
  id: string
  title: string
  content: string
  completed: boolean
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
    }[]
  }
  progress: number
}

export interface Course {
  id: string
  title: string
  description: string
  chapters: Chapter[]
  totalProgress: number
}

