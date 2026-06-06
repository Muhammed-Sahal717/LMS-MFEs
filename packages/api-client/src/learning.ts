import { api } from "./client";
import type { CourseOut, LessonOut, LessonProgressOut, Page } from "./types";

/** Learning endpoints: lessons + progress. */
export const learningApi = {
  // Backend doesn't provide enrolled course list yet; fall back to catalog list.
  myCourses: () => api.get<Page<CourseOut>>("/courses").then((page) => page.items),
  lessons: (courseId: string) => api.get<LessonOut[]>(`/learning/courses/${courseId}/lessons`),
  markComplete: (lessonId: string, lastPositionSeconds = 0) =>
    api.post<LessonProgressOut>(
      `/learning/lessons/${lessonId}/complete`,
      { last_position_seconds: lastPositionSeconds },
    ),
  progress: () => api.get<LessonProgressOut[]>("/learning/progress"),
};
