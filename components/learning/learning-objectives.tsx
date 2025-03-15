import { CheckCircle2 } from "lucide-react";

interface LearningObjectivesProps {
  objectives: string[];
}

export function LearningObjectives({ objectives }: LearningObjectivesProps) {
  if (!objectives || objectives.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6 p-4 bg-muted/30 rounded-lg border">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        Learning Objectives
      </h3>
      <ul className="space-y-2">
        {objectives.map((objective, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <div className="h-5 w-5 flex items-center justify-center mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            </div>
            <span>{objective}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 