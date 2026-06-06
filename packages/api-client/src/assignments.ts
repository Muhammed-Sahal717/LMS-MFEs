import { api } from "./client";
import type {
  AssignmentOut,
  GradeOut,
  Page,
  QuizOut,
  SubmissionOut,
} from "./types";

/** Assignment, quiz, and grade endpoints (backend). */
export const assignmentsApi = {
  list: () => api.get<Page<AssignmentOut>>("/assignments").then((page) => page.items),
  get: (id: string) => api.get<AssignmentOut>(`/assignments/${id}`),
  submit: (id: string, payload: { content?: string; file_url?: string; answers?: Record<string, string[]> }) =>
    api.post<SubmissionOut>(`/assignments/${id}/submit`, payload),
  grades: () => api.get<Page<GradeOut>>("/assignments/grades/me").then((page) => page.items),
  gradeSubmission: (submissionId: string, payload: any) =>
    api.post<GradeOut>(`/assignments/submissions/${submissionId}/grade`, payload),
  getQuiz: async (id: string): Promise<QuizOut | null> => {
    const assignment = await api.get<AssignmentOut>(`/assignments/${id}`);
    return assignment.quiz ?? null;
  },
};
