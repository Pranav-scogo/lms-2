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
  // Create a chapter from each section in the API response
  const chapters: Chapter[] = apiResponse.sections.map((section, sectionIndex) => {
    // Create a subsection for each section's content
    const subsections: SubSection[] = [
      {
        id: `section-${section.page}`,
        title: `Page ${section.page} Content`,
        content: section.summary,
        completed: false,
      }
    ];

    return {
      id: `chapter-${sectionIndex + 1}`,
      title: `Chapter ${sectionIndex + 1}`,
      description: section.summary.substring(0, 100) + "...",
      subsections,
      quiz: {
        id: `quiz-${sectionIndex + 1}`,
        questions: section.questions.map((q, idx) => ({
          id: idx + 1,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        })).slice(0, 5), // Limit to 5 questions per chapter
      },
      progress: 0,
    };
  });

  // Create the course object
  const course: Course = {
    id: `course-${Date.now()}`,
    title,
    description: apiResponse.final_summary,
    chapters,
    totalProgress: 0,
  };

  return course;
} 