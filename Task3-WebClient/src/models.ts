export interface GameModel {
  id: number;
  name: string;
  description: string;
  datetime: string;
  duration: number;
  trainerId: number;
}

export interface Tokens {
  access: string;
  refresh: string;
}
