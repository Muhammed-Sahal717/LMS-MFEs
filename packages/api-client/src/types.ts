/**
 * DTOs for the LMS.
 *
 * The BACKEND CONTRACT types below (snake_case) mirror the FastAPI responses
 * and are authoritative for integrated zones. Once the backend is hosted,
 * regenerate exact types with `pnpm gen:api` (writes schema.d.ts from
 * /openapi.json) and migrate modules onto them.
 *
 * The LEGACY types further down (camelCase: User/Course/Lesson/...) back the
 * not-yet-integrated zone UIs and will be retired zone-by-zone.
 */

// ===== BACKEND CONTRACT (snake_case, real API) =====

/** Pagination envelope: Page<T>. */
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;
}

export interface UserOut {
  id: string;
  email: string;
  full_name?: string | null;
  is_active?: boolean;
  created_at?: string;
}

/** GET /auth/me — user + roles + resolved permissions. */
export interface MeOut extends UserOut {
  roles: string[];
  permissions: string[];
  /** Licensed module codes, if the backend includes them. */
  modules?: string[];
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name?: string;
}

// ===== LEGACY (camelCase, pre-integration zone UIs) =====

export type Role = "student" | "instructor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructor: string;
  lessonCount: number;
  thumbnailUrl?: string;
  enrolled?: boolean;
  /** 0–100, populated by the learning zone. */
  progressPercent?: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  type: "video" | "reading";
  durationMinutes: number;
  completed: boolean;
  /** Video embed URL (type "video"). */
  videoUrl?: string;
  /** Reading body text (type "reading"). */
  body?: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progressPercent: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string; // ISO
  status: "pending" | "submitted" | "graded";
}

export interface Submission {
  id: string;
  assignmentId: string;
  userId: string;
  submittedAt: string;
  fileUrl?: string;
}

export interface Grade {
  assignmentId: string;
  score: number;
  maxScore: number;
  feedback?: string;
}

/** Grade joined with its assignment title (returned by GET /grades). */
export interface GradeView extends Grade {
  title: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  /** Index of correct option. Mock-only; a real backend would not send this. */
  correctIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizResult {
  score: number;
  maxScore: number;
}

export interface Activity {
  id: string;
  label: string;
  type: "lesson" | "assignment" | "enrollment";
  at: string; // ISO
}

export interface CreateCoursePayload {
  title: string;
  description: string;
  instructor: string;
}

export interface CreateLessonPayload {
  title: string;
  type: "video" | "reading";
  durationMinutes: number;
}

export interface AdminAnalytics {
  totalCourses: number;
  totalStudents: number;
  totalLessons: number;
  completionRate: number;
  enrollmentsByCourse: { title: string; lessons: number }[];
}

export interface DashboardSummary {
  user: User;
  enrolledCourses: number;
  completedLessons: number;
  pendingAssignments: number;
  upcomingAssignments: Assignment[];
  recentActivity: Activity[];
}
