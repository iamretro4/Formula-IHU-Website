
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: string;
  image?: string | null; // Optional image URL
}

export interface QuizData {
  id: string | number;
  title: string;
  globalStartTime: Date;
  endTime: Date;
  questions: Question[];
}

export interface TeamInfo {
  name: string;
  email: string;
}

export interface Answers {
  [questionId: number]: string;
}

export enum QuizStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}
