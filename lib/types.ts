export interface Course {
  id: string;
  title: string;
  description: string;
  status: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz" | "file";
  position: number;
  preview?: number;
  content: VideoContent | TextContent | QuizContent | FileContent;
}

export interface VideoContent {
  url: string;
  duration_sec?: number;
}

export interface TextContent {
  markdown: string;
}

export interface QuizContent {
  questions: Question[];
  pass_score: number;
}

export interface Question {
  text: string;
  options: { text: string }[];
  correct_option_index: number;
}

export interface FileContent {
  url: string;
  filename: string;
  size_bytes?: number;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  created_at: string;
  expires_at?: string;
  certificate_url?: string;
  course?: Course;
}

export interface Progress {
  lesson_id: string;
  completed: boolean;
  score?: number;
  completed_at?: string;
}
