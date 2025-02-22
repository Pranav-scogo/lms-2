import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, PlayCircle, Trophy } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "completion",
    course: "Machine Learning Fundamentals",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    id: 2,
    type: "progress",
    course: "Web Development Basics",
    time: "4 hours ago",
    icon: PlayCircle,
    color: "text-blue-500",
  },
  {
    id: 3,
    type: "achievement",
    course: "Python Programming",
    time: "1 day ago",
    icon: Trophy,
    color: "text-yellow-500",
  },
  // Add more activities as needed
]

export function RecentActivity() {
  return (
    <ScrollArea className="h-[350px]">
      <div className="space-y-8">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={`${activity.color} mt-1`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{activity.course}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.type === "completion"
                    ? "Completed the course"
                    : activity.type === "progress"
                      ? "Continued learning"
                      : "Earned an achievement"}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

