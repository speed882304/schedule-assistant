"use client";

import { useEffect, useState } from "react";
import { Course, DAY_LABELS, COURSE_COLORS } from "@/types";

interface Props {
  currentWeek: number;
}

export default function ScheduleView({ currentWeek }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const weekCourses = courses.filter((c) => c.weeks.includes(currentWeek));

  const getColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COURSE_COLORS[Math.abs(hash) % COURSE_COLORS.length];
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/schedule/${id}`, { method: "DELETE" });
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="text-2xl font-bold mb-6">课程表</h2>
      <div className="space-y-6 max-w-3xl">
        {days.map((day) => {
          const dayCourses = weekCourses
            .filter((c) => c.day === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          if (dayCourses.length === 0) return null;

          return (
            <div key={day}>
              <h3 className="text-lg font-semibold text-gray-300 mb-3 sticky top-0 bg-[#0f0f0f] py-2">
                {DAY_LABELS[day]}
              </h3>
              <div className="space-y-3">
                {dayCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 flex items-start gap-4 group hover:border-gray-700 transition-colors"
                  >
                    <div
                      className="w-1 h-full min-h-[60px] rounded-full shrink-0"
                      style={{ backgroundColor: getColor(course.name) }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-100">{course.name}</h4>
                        <span className="text-xs text-gray-500">
                          第{course.weeks[0]}-{course.weeks[course.weeks.length - 1]}周
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                        <span>
                          {course.startTime} - {course.endTime}
                        </span>
                        <span>{course.location}</span>
                        <span>{course.teacher}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 shrink-0 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {courses.length === 0 && (
          <p className="text-gray-500 text-center py-20">暂无课程，点击侧边栏&ldquo;添加课程&rdquo;开始</p>
        )}
        {courses.length > 0 && weekCourses.length === 0 && (
          <p className="text-gray-500 text-center py-20">第 {currentWeek} 周没有课程安排</p>
        )}
      </div>
    </div>
  );
}
