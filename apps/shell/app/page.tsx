"use client";

import { useAuth } from "@lms/api-client";
import { Button } from "@lms/ui";

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white pt-24 pb-32 lg:pt-36 lg:pb-40">
          <div className="absolute inset-y-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50 via-white to-white" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Unlock Your Potential</span>
              <span className="block text-brand-600 mt-2">Anywhere, Anytime.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 sm:text-xl">
              A premium, comprehensive learning management platform designed to help you master new skills through interactive lessons, real-time assessments, and community-driven learning.
            </p>
            <div className="mx-auto mt-10 flex max-w-sm flex-col justify-center gap-4 sm:max-w-none sm:flex-row">
              {loading ? (
                <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200" />
              ) : user ? (
                <a href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto px-8 shadow-lg shadow-brand-500/30">
                    Go to Dashboard
                  </Button>
                </a>
              ) : (
                <a href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto px-8 shadow-lg shadow-brand-500/30">
                    Start Learning for Free
                  </Button>
                </a>
              )}
              <a href="/courses">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8">
                  Browse Catalog
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to succeed</h2>
              <p className="mt-4 text-lg text-gray-500">Built with modern technology to deliver a seamless educational experience.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 text-2xl">
                  🎥
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">Interactive Learning</h3>
                <p className="mt-2 text-gray-500 leading-relaxed">
                  Engage with high-quality video lectures, comprehensive reading materials, and downloadable resources optimized for any device.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-2xl">
                  📝
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">Dynamic Assessments</h3>
                <p className="mt-2 text-gray-500 leading-relaxed">
                  Test your knowledge with auto-graded quizzes and comprehensive assignment submissions to ensure you're mastering the material.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 text-2xl">
                  📊
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">Progress Tracking</h3>
                <p className="mt-2 text-gray-500 leading-relaxed">
                  Monitor your educational journey through an intuitive dashboard that tracks completed lessons, grades, and upcoming deadlines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-16 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
              <div>
                <div className="text-4xl font-extrabold text-brand-600">50k+</div>
                <div className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Active Students</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-brand-600">100+</div>
                <div className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Premium Courses</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-brand-600">98%</div>
                <div className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Completion Rate</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-brand-600">24/7</div>
                <div className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Platform Access</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-sm text-gray-400">
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="/courses" className="hover:text-white transition-colors">Course Catalog</a></li>
                <li><a href="/auth/login" className="hover:text-white transition-colors">Student Login</a></li>
                <li><a href="/auth/register" className="hover:text-white transition-colors">Create Account</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-semibold text-white mb-4">Powered by LMS</h4>
              <p className="text-gray-500 leading-relaxed">
                A modern, multi-tenant micro-frontend architecture designed for scale.
              </p>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} LMS Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
