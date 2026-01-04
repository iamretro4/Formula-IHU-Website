
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: string;
  image?: string | null; // Optional image URL
  category?: 'common' | 'EV' | 'CV'; // Question category
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
  vehicleCategory?: 'EV' | 'CV'; // Vehicle category selected by team
  preferredTeamNumber?: string;
  alternativeTeamNumber?: string;
  fuelType?: string; // Only for CV teams
}

export interface Answers {
  [questionId: number]: string;
}

export enum QuizStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}
