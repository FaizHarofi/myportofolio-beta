"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2m0-12a9 9 0 110 18 9 9 0 010-18z"
                />
              </svg>
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
            Something went wrong
          </h1>

          {/* Error Description */}
          <p className="text-gray-600 text-center mb-8">
            We apologize for the inconvenience. An unexpected error occurred.
            Please try again or contact support if the problem persists.
          </p>

          {/* Error Details (if available) */}
          {error?.message && (
            <div className="mb-8 p-3 bg-gray-100 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 font-mono text-left">
                {error.message}
              </p>
            </div>
          )}

          {/* Error Code */}
          {error?.digest && (
            <p className="text-xs text-gray-400 mb-8 text-center">
              Reference ID: {error.digest}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <a
              href="/"
              className="w-full px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors text-center"
            >
              Go Home
            </a>
          </div>

          {/* Support Text */}
          <p className="mt-6 text-sm text-gray-500 text-center">
            Need assistance?{" "}
            <a
              href="/contact"
              className="text-blue-600 hover:underline font-medium"
            >
              Contact us
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
