import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, Brain, Trophy, ArrowRight, Upload } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent to-background pt-32 pb-40">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Smart Learning Platform</span>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                  Learn Smarter with{" "}
                  <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    SIA LMS
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-[600px]">
                  Transform your learning experience with our intelligent platform. Interactive lessons, smart quizzes,
                  and personalized progress tracking.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg h-12" asChild>
                  <Link href="/learn">
                    Start Learning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg h-12" asChild>
                  <Link href="/upload">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Course
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative lg:block hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
              <div className="relative grid grid-cols-2 gap-6">
                <div className="space-y-6 animate-float" style={{ animationDelay: "0.2s" }}>
                  <div className="glass-effect p-6 rounded-2xl">
                    <BookOpen className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">Interactive Learning</h3>
                    <p className="text-sm text-muted-foreground">Engage with dynamic content</p>
                  </div>
                  <div className="glass-effect p-6 rounded-2xl">
                    <Trophy className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">Track Progress</h3>
                    <p className="text-sm text-muted-foreground">Monitor your achievements</p>
                  </div>
                </div>
                <div className="space-y-6 pt-12 animate-float" style={{ animationDelay: "0.4s" }}>
                  <div className="glass-effect p-6 rounded-2xl">
                    <Brain className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">Smart Quizzes</h3>
                    <p className="text-sm text-muted-foreground">Test your knowledge</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Follow these simple steps to start your learning journey with SIA LMS.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="bg-card p-8 rounded-3xl border relative z-10">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Upload Your Course</h3>
                <p className="text-muted-foreground">Upload a PDF document with your learning material.</p>
              </div>
              <div className="absolute top-1/2 right-0 translate-x-1/2 translate-y-[-50%] hidden md:block">
                <ArrowRight className="h-8 w-8 text-muted-foreground/40" />
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-card p-8 rounded-3xl border relative z-10">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Learn at Your Pace</h3>
                <p className="text-muted-foreground">Go through the generated chapters and sections at your own pace.</p>
              </div>
              <div className="absolute top-1/2 right-0 translate-x-1/2 translate-y-[-50%] hidden md:block">
                <ArrowRight className="h-8 w-8 text-muted-foreground/40" />
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-card p-8 rounded-3xl border relative z-10">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Test Your Knowledge</h3>
                <p className="text-muted-foreground">Take quizzes to test your understanding and track your progress.</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-16">
            <Button size="lg" className="text-lg h-12" asChild>
              <Link href="/upload">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose SIA LMS?</h2>
            <p className="text-muted-foreground">
              Our platform combines modern learning techniques with advanced technology to provide you with the best
              learning experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={feature.title} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative bg-card p-8 rounded-3xl border transition-all duration-200 hover:shadow-lg">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

const features = [
  {
    icon: BookOpen,
    title: "Structured Learning Path",
    description: "Follow a carefully designed curriculum that ensures steady progress and comprehensive understanding.",
  },
  {
    icon: Brain,
    title: "Interactive Content",
    description: "Engage with dynamic content that adapts to your learning style and pace.",
  },
  {
    icon: Trophy,
    title: "Achievement System",
    description: "Track your progress and earn certificates as you complete courses and master new skills.",
  },
]

