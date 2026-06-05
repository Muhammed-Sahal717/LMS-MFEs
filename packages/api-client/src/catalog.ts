import { api } from "./client";
import type { CourseDetailOut, CourseOut, EnrollmentOut, Page } from "./types";

/** Course catalog endpoints (backend). */
export const catalogApi = {
  list: () => api.get<Page<CourseOut>>("/courses").then((page) => page.items),
  get: (courseId: string) => api.get<CourseDetailOut>(`/courses/${courseId}`),
  enroll: (id: string) => api.post<EnrollmentOut>(`/courses/${id}/enroll`, {}),
};
