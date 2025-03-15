import { ProcessPdfResponse } from "@/types/api";
import { Course, Chapter, SubSection } from "@/types/course";

/**
 * Converts a PDF processing API response into a course structure
 * 
 * @param apiResponse - The API response from processing the PDF
 * @param title - Optional title for the course (defaults to "Your Uploaded Course")
 * @returns A Course object
 */
export function mapApiResponseToCourse(
  apiResponse: ProcessPdfResponse,
  title: string = "Your Uploaded Course"
): Course {
  // Create a chapter from each module in the API response
  const chapters: Chapter[] = apiResponse.modules.map((module, moduleIndex) => {
    // Create a subsection for each module's content
    const subsections: SubSection[] = [
      {
        id: `module-${moduleIndex + 1}`,
        title: module.module_name,
        content: module.content_summary,
        completed: false,
        key_concepts: module.key_concepts,
        learning_objectives: module.learning_objectives,
      }
    ];

    return {
      id: `chapter-${moduleIndex + 1}`,
      title: module.module_name,
      description: module.content_summary.substring(0, 100) + "...",
      subsections,
      quiz: {
        id: `quiz-${moduleIndex + 1}`,
        questions: module.section_quiz.map((q, idx) => ({
          id: idx + 1,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })).slice(0, 5), // Limit to 5 questions per chapter
      },
      progress: 0,
    };
  });

  // Create the course object
  const course: Course = {
    id: `course-${Date.now()}`,
    title,
    description: apiResponse.comprehensive_summary,
    chapters,
    totalProgress: 0,
    // Store the final quiz separately since it spans all modules
    final_quiz: apiResponse.final_quiz.map((q, idx) => ({
      id: idx + 1,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      related_modules: q.related_modules,
    })),
  };

  return course;
} 