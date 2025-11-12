
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: string;
}

export interface QuizData {
  id: number;
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
