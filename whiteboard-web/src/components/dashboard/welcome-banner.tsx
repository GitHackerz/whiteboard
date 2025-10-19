"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { User } from "@/actions/utils/types";

interface WelcomeBannerProps {
  user: User;
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
  const firstName = user.firstName || 'Student';
  
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 sm:p-8 text-white shadow-2xl">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent)]" />
        <div className="absolute left-0 top-0 h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 space-y-3 sm:space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/30">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <span className="text-white font-semibold">New semester started</span>
          </div>

          <div>
            <h1 className="mb-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Welcome back, <span className="wave inline-block">👋</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {firstName}!
              </span>
            </h1>
            <p className="max-w-md text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed">
              Ready to continue your learning journey? Check out your courses and assignments below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold shadow-lg border-0 w-full sm:w-auto transition-all duration-200 hover:shadow-xl hover:scale-105"
              size="lg"
            >
              <span className="flex items-center gap-2">
                View Courses
                <span className="text-lg">📚</span>
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white backdrop-blur-sm w-full sm:w-auto transition-all duration-200"
              size="lg"
            >
              <span className="flex items-center gap-2">
                Quick Actions
                <span className="text-lg">⚡</span>
              </span>
            </Button>
          </div>
        </motion.div>

        {/* Enhanced Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block"
        >
          <div className="relative h-64 w-64">
            {/* Floating icons */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-0 top-0 z-10"
            >
              <div className="text-4xl">🎯</div>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute bottom-10 left-0 z-20"
            >
              <div className="text-3xl">⭐</div>
            </motion.div>
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute right-10 top-20 z-30"
            >
              <div className="text-2xl">🚀</div>
            </motion.div>

            {/* Central book icon */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-5"
            >
              <div className="text-7xl drop-shadow-lg">📚</div>
            </motion.div>

            {/* Floating particles */}
            <motion.div
              animate={{
                x: [0, 20, 0],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute left-5 top-5 z-40"
            >
              <div className="text-lg">✨</div>
            </motion.div>

            <motion.div
              animate={{
                x: [0, -15, 0],
                y: [0, 8, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3
              }}
              className="absolute right-5 bottom-5 z-40"
            >
              <div className="text-sm">💫</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .wave {
          animation: wave 2.5s infinite;
          display: inline-block;
          transform-origin: 70% 70%;
        }
        @keyframes wave {
          0%,
          100% {
            transform: rotate(0deg);
          }
          10%,
          30% {
            transform: rotate(14deg);
          }
          20% {
            transform: rotate(-8deg);
          }
          40% {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </Card>
  );
}
