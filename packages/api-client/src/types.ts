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
  tenant_id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string | null;
  created_at: string;
  roles: RoleOut[];
}

export interface RoleOut {
  id: string;
  code: string;
  name: string;
}

/** GET /auth/me — user + roles + resolved permissions. */
export interface MeOut extends UserOut {
  permissions: string[];
  /** Licensed module codes, if the backend includes them. */
  modules?: string[];
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name?: string;
}

export type CourseStatus = "draft" | "published" | "archived";
export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface CourseOut {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  category_id?: string | null;
  status: CourseStatus;
  level: CourseLevel;
  is_free: boolean;
  price: string;
  thumbnail_url?: string | null;
  enrollment_count: number;
  published_at?: string | null;
  created_at: string;
}

export interface CourseDetailOut extends CourseOut {
  description?: string | null;
}

export interface CourseCreate {
  title: string;
  slug: string;
  summary?: string | null;
  description?: string | null;
  level?: CourseLevel;
  is_free?: boolean;
  price?: string | number;
  thumbnail_url?: string | null;
  category_id?: string | null;
}

export interface EnrollmentOut {
  id: string;
  course_id: string;
  user_id: string;
  status: "active" | "completed" | "cancelled";
  progress_pct: number;
  enrolled_at: string;
  completed_at?: string | null;
}

export type LessonType = "video" | "document" | "text";

export interface VideoAssetOut {
  url: string;
  hls_url?: string | null;
  duration_seconds: number;
}

export interface DocumentAssetOut {
  file_url: string;
  file_type: string;
  size_bytes: number;
}

export interface LessonOut {
  id: string;
  course_id: string;
  module_id?: string | null;
  title: string;
  content_type: LessonType;
  order_index: number;
  duration_seconds: number;
  is_preview: boolean;
  video?: VideoAssetOut | null;
  document?: DocumentAssetOut | null;
}

export interface LessonProgressOut {
  id: string;
  lesson_id: string;
  course_id: string;
  status: "not_started" | "in_progress" | "completed";
  last_position_seconds: number;
  completed_at?: string | null;
}

export type AssignmentType = "assignment" | "quiz";

export interface QuizAnswerOut {
  id: string;
  text: string;
}

export type QuestionType = "single" | "multiple" | "boolean";

export interface QuizQuestionOut {
  id: string;
  text: string;
  type: QuestionType;
  points: string;
  order_index: number;
  answers: QuizAnswerOut[];
}

export interface QuizOut {
  id: string;
  time_limit_seconds: number;
  questions: QuizQuestionOut[];
}

export interface AssignmentOut {
  id: string;
  course_id: string;
  title: string;
  description?: string | null;
  type: AssignmentType;
  max_points: string;
  pass_points: string;
  due_at?: string | null;
  is_published: boolean;
  quiz?: QuizOut | null;
}

export interface SubmissionOut {
  id: string;
  assignment_id: string;
  user_id: string;
  content?: string | null;
  file_url?: string | null;
  status: "submitted" | "graded" | "returned";
  submitted_at: string;
}

export interface GradeOut {
  id: string;
  submission_id: string;
  assignment_id: string;
  user_id: string;
  points: string;
  max_points: string;
  feedback?: string | null;
  is_auto: boolean;
  graded_at: string;
}

export interface ActivityItem {
  action: string;
  resource: string;
  resource_id?: string | null;
  created_at: string;
}

export interface DashboardOut {
  enrolled_courses: number;
  completed_lessons: number;
  pending_assignments: number;
  submissions: number;
  recent_activity: ActivityItem[];
}

export interface ReportOut {
  users: number;
  courses: number;
  enrollments: number;
  submissions: number;
  active_modules: string[];
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
