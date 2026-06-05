import { api } from "./client";
import type { CourseCreate, CourseOut, Page, ReportOut, UserOut } from "./types";

/** Instructor/admin endpoints (backend). */
export const adminApi = {
  courses: () => api.get<Page<CourseOut>>("/courses").then((page) => page.items),
  createCourse: (payload: CourseCreate) => api.post<CourseOut>("/admin/courses", payload),
  users: () => api.get<Page<UserOut>>("/admin/users").then((page) => page.items),
  analytics: () => api.get<ReportOut>("/admin/reports"),
};
