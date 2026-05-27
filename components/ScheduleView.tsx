"use client";

import { useEffect, useState, useMemo } from "react";
import { Course, COURSE_COLORS } from "@/types";

interface Props {
  currentWeek: number;
}

const DAY_LABELS: Record<number, string> = {
  1: "周一", 2: "周二", 3: "周三", 4: "周四", 5: "周五", 6: "周六", 7: "周日",
};

const DAYS = [1, 2, 3, 4, 5, 6, 7];

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

  const timeSlots = useMemo(() => {
    const slots = new Set<string>();
    weekCourses.forEach((c) => {
      slots.add(`${c.startTime}-${c.endTime}`);
    });
    return Array.from(slots).sort((a, b) => {
      return a.split("-")[0].localeCompare(b.split("-")[0]);
    });
  }, [weekCourses]);

  const grid = useMemo(() => {
    const map: Record<string, Course[]> = {};
    weekCourses.forEach((c) => {
      const key = `${c.day}-${c.startTime}-${c.endTime}`;
      if (!map[key]) map[key] = [];
      map[key].push(c);
    });
    return map;
  }, [weekCourses]);

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

  return (
    <div className="h-full overflow-auto p-3 md:p-4 relative">
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage: "url('/schedule-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          backgroundColor: "rgba(15, 15, 15, 0.4)",
        }}
      />
      <div style={{ position: "relative", zIndex: 10 }}>
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">课程表 · 第 {currentWeek} 周</h2>

      {timeSlots.length === 0 ? (
        <p className="text-gray-500 text-center py-20">
          {courses.length === 0
            ? "暂无课程，点击侧边栏&ldquo;添加课程&rdquo;开始"
            : `第 ${currentWeek} 周没有课程安排`}
        </p>
      ) : (
        <div className="overflow-x-auto -mx-3 md:mx-0">
          <table
            className="border-collapse border border-gray-700 rounded-lg overflow-hidden w-full"
            style={{ minWidth: "640px" }}
          >
            <thead>
              <tr>
                <th
                  className="text-center text-xs md:text-sm font-semibold text-gray-300 py-2 md:py-3 border-b border-r border-gray-700 w-[50px] md:w-[70px]"
                  style={{ backgroundColor: "rgba(30, 30, 30, 0.9)" }}
                >
                  时间
                </th>
                {DAYS.map((d) => (
                  <th
                    key={d}
                    className="text-center text-xs md:text-sm font-semibold text-gray-300 py-2 md:py-3 border-b border-r border-gray-700"
                    style={{ backgroundColor: "rgba(30, 30, 30, 0.9)" }}
                  >
                    {DAY_LABELS[d]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => {
                const [start, end] = slot.split("-");
                return (
                  <tr key={slot}>
                    <td
                      className="text-center text-xs md:text-sm text-gray-300 py-3 md:py-4 border-b border-r border-gray-700 align-middle"
                      style={{ backgroundColor: "rgba(26, 26, 26, 0.7)" }}
                    >
                      <div className="font-semibold">{start}</div>
                      <div className="text-[10px] md:text-xs text-gray-400 mt-0.5">{end}</div>
                    </td>
                    {DAYS.map((day) => {
                      const key = `${day}-${start}-${end}`;
                      const cellCourses = grid[key];
                      return (
                        <td
                          key={day}
                          className="border-b border-r border-gray-700 p-1 md:p-2 align-top"
                          style={{
                            backgroundColor: "rgba(20, 20, 20, 0.6)",
                            width: `${100 / 7}%`,
                          }}
                        >
                          {cellCourses?.map((course) => (
                            <div
                              key={course.id}
                              className="rounded-lg p-1.5 md:p-2.5 relative group"
                              style={{
                                backgroundColor: getColor(course.name) + "22",
                                borderLeft: `3px solid ${getColor(course.name)}`,
                              }}
                            >
                              <div className="font-semibold text-gray-100 text-xs md:text-[15px] mb-0.5">
                                {course.name}
                              </div>
                              <div className="text-gray-400 text-[11px] md:text-sm leading-relaxed">
                                {course.teacher}
                              </div>
                              <div className="text-gray-400 text-[11px] md:text-sm leading-relaxed">
                                {course.location}
                              </div>
                              <div className="text-gray-500 text-[10px] md:text-xs mt-0.5">
                                {course.weeks[0]}-{course.weeks[course.weeks.length - 1]}周
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(course.id);
                                }}
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                              >
                                <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}
