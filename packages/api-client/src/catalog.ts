import { api } from "./client";
import type { Course } from "./types";

/** Course catalog endpoints. Mock-backed now, real backend later. */
export const catalogApi = {
  list: () => api.get<Course[]>("/courses"),
  get: (slug: string) => api.get<Course>(`/courses/${slug}`),
  enroll: (id: string) => api.post<Course>(`/courses/${id}/enroll`, {}),
};
