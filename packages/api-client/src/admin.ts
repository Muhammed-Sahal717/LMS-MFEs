import { api } from "./client";
import type { CourseCreate, CourseOut, Page, ReportOut, UserOut, UserCreate, TenantCreate, CourseUpdate, TenantOut, UserUpdate, LessonCreate, LessonOut, AssignmentCreate, AssignmentOut, TenantModuleOut } from "./types";

/** Instructor/admin endpoints (backend). */
export const adminApi = {
  courses: () => api.get<Page<CourseOut>>("/admin/courses").then((page) => page.items),
  getCourse: (id: string) => api.get<CourseOut>(`/admin/courses/${id}`),
  createCourse: (payload: CourseCreate) => api.post<CourseOut>("/admin/courses", payload),
  updateCourse: (id: string, payload: CourseUpdate) => api.put<CourseOut>(`/admin/courses/${id}`, payload),
  deleteCourse: (id: string) => api.del<{ message: string }>(`/admin/courses/${id}`),
  getCourseLessons: (courseId: string) => api.get<LessonOut[]>(`/admin/courses/${courseId}/lessons`),
  createLesson: (courseId: string, payload: LessonCreate) => api.post<LessonOut>(`/admin/courses/${courseId}/lessons`, payload),
  getCourseAssignments: (courseId: string) => api.get<AssignmentOut[]>(`/admin/courses/${courseId}/assignments`),
  createAssignment: (courseId: string, payload: AssignmentCreate) => api.post<AssignmentOut>(`/admin/courses/${courseId}/assignments`, payload),
  users: () => api.get<Page<UserOut>>("/admin/users").then((page) => page.items),
  createUser: (payload: UserCreate) => api.post<UserOut>("/admin/users", payload),
  updateUser: (id: string, payload: UserUpdate) => api.put<UserOut>(`/admin/users/${id}`, payload),
  analytics: () => api.get<ReportOut>("/admin/reports"),
  tenants: () => api.get<TenantOut[]>("/admin/tenants"),
  createTenant: (payload: TenantCreate) => api.post<TenantOut>("/admin/tenants", payload),
  listTenantModules: (tenantId: string) => api.get<TenantModuleOut[]>(`/admin/tenants/${tenantId}/modules`),
  toggleTenantModule: (tenantId: string, payload: { code: string; enabled: boolean }) => api.put<{message: string}>(`/admin/tenants/${tenantId}/modules`, payload),
};
