import { Card, Button } from "@lms/ui";

const zones = [
  { label: "Course Catalog", href: "/courses", desc: "Browse, search, enroll.", icon: "📚" },
  { label: "Learning", href: "/learn", desc: "Videos, readings, progress.", icon: "🎥" },
  { label: "Assignments", href: "/assignments", desc: "Submit work, quizzes, grades.", icon: "📝" },
  { label: "Dashboard", href: "/dashboard", desc: "Your overview at a glance.", icon: "📊" },
  { label: "Admin", href: "/admin", desc: "Instructor & admin tools.", icon: "⚙️" },
  { label: "Auth", href: "/auth/login", desc: "Login, register, sessions.", icon: "🔐" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900">Welcome to the LMS</h1>
      <p className="mt-2 text-gray-600">
        Micro-frontend shell. Each card links to a separate MFE zone (full-page nav).
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {zones.map((z) => (
          <Card key={z.href} header={<span>{z.icon} {z.label}</span>}>
            <p className="text-sm text-gray-600">{z.desc}</p>
            <a href={z.href} className="mt-4 inline-block">
              <Button size="sm" variant="secondary">Open</Button>
            </a>
          </Card>
        ))}
      </div>

      <p className="mt-10 rounded-lg border border-dashed border-border bg-white p-4 text-sm text-gray-500">
        Zones are stubbed until each MFE is built. Links 404 for now — enable the
        matching rewrite in <code>next.config.ts</code> as you scaffold each app.
      </p>
    </div>
  );
}
