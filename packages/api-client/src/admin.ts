import { api } from "./client";
import type { CourseCreate, CourseOut, Page, ReportOut, UserOut } from "./types";

/** Instructor/admin endpoints (backend). */
export const adminApi = {
  courses: () => api.get<Page<CourseOut>>("/courses").then((page) => page.items),
  createCourse: (payload: CourseCreate) => api.post<CourseOut>("/admin/courses", payload),
  updateCourse: (id: string, payload: Partial<CourseCreate>) => api.put<CourseOut>(`/admin/courses/${id}`, payload),
  deleteCourse: (id: string) => api.del<{ message: string }>(`/admin/courses/${id}`),
  users: () => api.get<Page<UserOut>>("/admin/users").then((page) => page.items),
  createUser: (payload: any) => api.post<UserOut>("/admin/users", payload),
  updateUser: (id: string, payload: any) => api.put<UserOut>(`/admin/users/${id}`, payload),
  analytics: () => api.get<ReportOut>("/admin/reports"),
  createTenant: (payload: any) => api.post<any>("/admin/tenants", payload),
  listTenantModules: (tenantId: string) => api.get<any>(`/admin/tenants/${tenantId}/modules`),
  toggleTenantModule: (tenantId: string, payload: any) => api.put<any>(`/admin/tenants/${tenantId}/modules`, payload),
};
