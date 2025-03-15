import { BookOpen } from "lucide-react";
import { KeyConcepts } from "./key-concepts";
import { LearningObjectives } from "./learning-objectives";

interface ModuleDetailProps {
  title: string;
  keyConcepts: string[];
  learningObjectives: string[];
  summary: string;
}

export function ModuleDetail({
  title,
  keyConcepts,
  learningObjectives,
  summary
}: ModuleDetailProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <div className="flex items-center gap-1 text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm">Learning Module</span>
        </div>
      </div>
      
      <KeyConcepts concepts={keyConcepts} />
      
      <LearningObjectives objectives={learningObjectives} />
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Module Content</h3>
        <div className="prose prose-sm max-w-none">
          {summary.split('\n').map((paragraph, index) => (
            paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
          ))}
        </div>
      </div>
    </div>
  );
} 