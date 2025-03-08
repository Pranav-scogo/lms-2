import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Upload, BarChart, Home } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <GraduationCap className="h-8 w-8" />
            <span>SIA LMS</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {/* <Link href="/" className="text-sm font-medium hover:text-primary flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link> */}
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/learn" className="text-sm font-medium hover:text-primary">
              Learn
            </Link>
            <Link href="/progress" className="text-sm font-medium hover:text-primary">
              Progress
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild className="hover:bg-primary/10">
            <Link href="/upload" className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              Upload Course
            </Link>
          </Button>
          {/* <Button asChild>
            <Link href="/learn">Get Started</Link>
          </Button> */}
        </div>
      </div>
    </header>
  )
}

