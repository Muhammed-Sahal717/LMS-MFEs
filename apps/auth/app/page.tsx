import { redirect } from "next/navigation";

/** /auth → /auth/login (basePath auto-prepended) */
export default function AuthIndex() {
  redirect("/login");
}
