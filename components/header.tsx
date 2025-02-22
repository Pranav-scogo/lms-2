import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"

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
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
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
          <Button variant="ghost" className="hover:text-primary">
            Login
          </Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </header>
  )
}

