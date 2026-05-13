"use client";

import Link from "next/link";

export function ForbiddenState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-6 py-12">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-(--dark) mb-2">Access Denied</h2>
      <p className="text-gray-500 text-sm max-w-sm">
        {message ?? "You do not have permission to view this page. Contact your administrator if you believe this is a mistake."}
      </p>
      <Link
        href="/"
        className="mt-6 px-5 py-2.5 bg-(--primary) text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
      >
        Go to Home
      </Link>
    </div>
  );
}

export function ServerErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-6 py-12">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-(--dark) mb-2">Something went wrong</h2>
      <p className="text-gray-500 text-sm max-w-sm">
        {message ?? "An unexpected error occurred. Please try again or contact support if the problem persists."}
      </p>
      <div className="flex items-center gap-3 mt-6">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2.5 bg-(--primary) text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
        )}
        <Link
          href="/"
          className="px-5 py-2.5 border border-gray-200 text-(--dark) text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
