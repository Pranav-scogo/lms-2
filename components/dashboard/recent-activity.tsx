import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, CheckCircle, ListPlus, PlayCircle, Trophy } from "lucide-react"

// Activity types for recent learning activities
interface Activity {
  id: string;
  type: "section_completed" | "quiz_completed" | "course_started" | "course_created";
  title: string;
  timestamp: Date;
  courseId?: string;
  courseName?: string;
}

interface RecentActivityProps {
  activities?: Activity[];
}

// Fallback activities if none are provided
const fallbackActivities: Activity[] = [
  {
    id: "1",
    type: "section_completed",
    title: "Section Completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    courseId: "sample-1",
    courseName: "Machine Learning Fundamentals"
  },
  {
    id: "2",
    type: "course_started",
    title: "Course Started",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    courseId: "sample-2",
    courseName: "Web Development Basics"
  },
  {
    id: "3",
    type: "quiz_completed",
    title: "Quiz Completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    courseId: "sample-3",
    courseName: "Python Programming"
  }
];

export function RecentActivity({ activities = fallbackActivities }: RecentActivityProps) {
  // Function to get relative time
  const getRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    
    // Convert to seconds
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) {
      return "just now";
    }
    
    // Convert to minutes
    const mins = Math.floor(seconds / 60);
    if (mins < 60) {
      return `${mins} ${mins === 1 ? "minute" : "minutes"} ago`;
    }
    
    // Convert to hours
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) {
      return `${hrs} ${hrs === 1 ? "hour" : "hours"} ago`;
    }
    
    // Convert to days
    const days = Math.floor(hrs / 24);
    if (days < 7) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
    
    // Format date for older timestamps
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };
  
  // Get icon and color based on activity type
  const getActivityDetails = (type: Activity["type"]) => {
    switch (type) {
      case "section_completed":
        return { Icon: CheckCircle, color: "text-green-500", description: "Completed a section" };
      case "quiz_completed":
        return { Icon: Trophy, color: "text-yellow-500", description: "Completed a quiz" };
      case "course_started":
        return { Icon: PlayCircle, color: "text-blue-500", description: "Started learning" };
      case "course_created":
        return { Icon: ListPlus, color: "text-purple-500", description: "Created a new course" };
      default:
        return { Icon: BookOpen, color: "text-primary", description: "Learning activity" };
    }
  };

  return (
    <ScrollArea className="h-[350px]">
      <div className="space-y-6">
        {activities.map((activity) => {
          const { Icon, color, description } = getActivityDetails(activity.type);
          return (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={`${color} mt-1 flex-shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.courseName || "Unknown Course"}
                </p>
                <p className="text-sm text-muted-foreground">{description}</p>
                <p className="text-xs text-muted-foreground">{getRelativeTime(activity.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

