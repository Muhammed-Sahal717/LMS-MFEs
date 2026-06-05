import { api } from "./client";
import type { Course, Lesson } from "./types";

/** Learning endpoints: enrolled courses, lessons, progress, mark complete. */
export const learningApi = {
  myCourses: () => api.get<Course[]>("/learn/courses"),
  lessons: (slug: string) => api.get<Lesson[]>(`/courses/${slug}/lessons`),
  markComplete: (lessonId: string) =>
    api.post<Lesson>(`/lessons/${lessonId}/complete`, {}),
};
