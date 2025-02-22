import { ScrollArea } from "@/components/ui/scroll-area"

const activities = [
  {
    id: 1,
    action: "Completed lesson",
    course: "Web Development Fundamentals",
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "Started quiz",
    course: "UI/UX Design Principles",
    time: "4 hours ago",
  },
  {
    id: 3,
    action: "Watched video",
    course: "Digital Marketing Essentials",
    time: "Yesterday",
  },
  {
    id: 4,
    action: "Completed quiz",
    course: "Web Development Fundamentals",
    time: "2 days ago",
  },
]

export function RecentActivity() {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex flex-col space-y-1">
            <span className="text-sm font-medium">{activity.action}</span>
            <span className="text-sm text-muted-foreground">{activity.course}</span>
            <span className="text-xs text-muted-foreground">{activity.time}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

