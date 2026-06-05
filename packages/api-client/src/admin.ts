import { api } from "./client";
import type {
  AdminAnalytics,
  Course,
  CreateCoursePayload,
  CreateLessonPayload,
  Lesson,
  User,
} from "./types";

/** Instructor/admin endpoints. */
export const adminApi = {
  courses: () => api.get<Course[]>("/courses"),
  createCourse: (payload: CreateCoursePayload) =>
    api.post<Course>("/admin/courses", payload),
  lessons: (slug: string) => api.get<Lesson[]>(`/courses/${slug}/lessons`),
  addLesson: (courseId: string, payload: CreateLessonPayload) =>
    api.post<Lesson>(`/admin/courses/${courseId}/lessons`, payload),
  users: () => api.get<User[]>("/admin/users"),
  analytics: () => api.get<AdminAnalytics>("/admin/reports"),
};
