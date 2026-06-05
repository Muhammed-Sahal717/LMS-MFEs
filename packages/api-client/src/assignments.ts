import { api } from "./client";
import type { Assignment, GradeView, Quiz, QuizResult } from "./types";

/** Assignment, quiz, and grade endpoints. */
export const assignmentsApi = {
  list: () => api.get<Assignment[]>("/assignments"),
  get: (id: string) => api.get<Assignment>(`/assignments/${id}`),
  submit: (id: string, text: string) =>
    api.post<Assignment>(`/assignments/${id}/submit`, { text }),
  grades: () => api.get<GradeView[]>("/grades"),
  getQuiz: (id: string) => api.get<Quiz>(`/quiz/${id}`),
  submitQuiz: (id: string, answers: number[]) =>
    api.post<QuizResult>(`/quiz/${id}/submit`, { answers }),
};
