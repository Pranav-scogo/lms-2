import type { Course } from "@/types/course"

export const sampleCourse: Course = {
  id: "ml-basics",
  title: "Machine Learning Fundamentals",
  description: "Learn the basics of machine learning and its applications",
  totalProgress: 0,
  chapters: [
    {
      id: "intro",
      title: "Introduction to Machine Learning",
      description: "Understanding the basics of machine learning",
      progress: 0,
      subsections: [
        {
          id: "what-is-ml",
          title: "What is Machine Learning?",
          content: `Machine Learning is a subset of artificial intelligence that focuses on developing systems that can learn and improve from experience. 

Unlike traditional programming where we explicitly write rules, machine learning algorithms learn patterns from data.

Key aspects of machine learning include:
- Learning from data
- Finding patterns
- Making predictions
- Improving with experience`,
          completed: false,
        },
        {
          id: "types-of-ml",
          title: "Types of Machine Learning",
          content: `There are three main types of machine learning:

1. Supervised Learning
- Learning from labeled data
- Examples: Classification, Regression
- Applications: Spam detection, Price prediction

2. Unsupervised Learning
- Finding patterns in unlabeled data
- Examples: Clustering, Dimensionality reduction
- Applications: Customer segmentation

3. Reinforcement Learning
- Learning through interaction with environment
- Examples: Game playing, Robot navigation
- Applications: Self-driving cars, Game AI`,
          completed: false,
        },
      ],
      quiz: {
        id: "intro-quiz",
        questions: [
          {
            id: 1,
            question: "What is the main difference between machine learning and traditional programming?",
            options: [
              "Machine learning requires no code",
              "Machine learning learns from data instead of explicit rules",
              "Traditional programming is faster",
              "There is no difference",
            ],
            correctAnswer: 1,
          },
          {
            id: 2,
            question: "Which type of machine learning uses labeled data?",
            options: ["Unsupervised Learning", "Reinforcement Learning", "Supervised Learning", "None of the above"],
            correctAnswer: 2,
          },
        ],
      },
    },
    {
      id: "applications",
      title: "Applications of Machine Learning",
      description: "Explore real-world applications of machine learning",
      progress: 0,
      subsections: [
        {
          id: "healthcare",
          title: "Healthcare Applications",
          content: `Machine Learning in Healthcare:

- Disease Detection
- Patient Data Analysis
- Drug Discovery
- Treatment Optimization

Machine learning is revolutionizing healthcare by enabling early disease detection and personalized treatment plans.`,
          completed: false,
        },
        {
          id: "finance",
          title: "Financial Applications",
          content: `Machine Learning in Finance:

- Fraud Detection
- Risk Assessment
- Algorithmic Trading
- Customer Service (Chatbots)

Financial institutions use machine learning to detect fraudulent transactions and automate decision-making processes.`,
          completed: false,
        },
      ],
      quiz: {
        id: "applications-quiz",
        questions: [
          {
            id: 1,
            question: "Which is NOT a common application of ML in healthcare?",
            options: ["Disease Detection", "Social Media Marketing", "Drug Discovery", "Treatment Planning"],
            correctAnswer: 1,
          },
          {
            id: 2,
            question: "How do banks primarily use machine learning?",
            options: ["To design buildings", "To detect fraud", "To cook food", "To print money"],
            correctAnswer: 1,
          },
        ],
      },
    },
  ],
}

