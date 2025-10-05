"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const stats = [
  {
    title: "Active Courses",
    value: "6",
    change: "+2 from last semester",
    icon: "📚",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Assignments",
    value: "12",
    change: "4 due this week",
    icon: "📝",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Average Grade",
    value: "92%",
    change: "+5% from last month",
    icon: "🏆",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Study Hours",
    value: "24h",
    change: "This week",
    icon: "📈",
    bgColor: "bg-orange-500/10",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StatsCards() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat) => {
        return (
          <motion.div key={stat.title} variants={item}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate pr-2">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor} flex-shrink-0 text-xl sm:text-2xl`}
                >
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
