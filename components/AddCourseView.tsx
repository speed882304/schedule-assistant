"use client";

import { useState } from "react";

interface Props {
  onAdded?: () => void;
}

export default function AddCourseView({ onAdded }: Props) {
  const [form, setForm] = useState({
    name: "",
    day: 1,
    startTime: "08:00",
    endTime: "09:40",
    location: "",
    teacher: "",
    weekStart: 1,
    weekEnd: 16,
    weekType: "all" as "all" | "odd" | "even",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    const weeks = Array.from(
      { length: form.weekEnd - form.weekStart + 1 },
      (_, i) => form.weekStart + i
    ).filter((w) => {
      if (form.weekType === "odd") return w % 2 === 1;
      if (form.weekType === "even") return w % 2 === 0;
      return true;
    });

    await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        day: form.day,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location,
        teacher: form.teacher,
        weeks,
      }),
    });

    setSubmitting(false);
    setSuccess(true);
    setForm({ name: "", day: 1, startTime: "08:00", endTime: "09:40", location: "", teacher: "", weekStart: 1, weekEnd: 16, weekType: "all" });
    setTimeout(() => setSuccess(false), 3000);
    onAdded?.();
  };

  const days = [
    { value: 1, label: "周一" },
    { value: 2, label: "周二" },
    { value: 3, label: "周三" },
    { value: 4, label: "周四" },
    { value: 5, label: "周五" },
    { value: 6, label: "周六" },
    { value: 7, label: "周日" },
  ];

  const inputClass =
    "w-full bg-[#1e1e1e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const labelClass = "block text-sm text-gray-400 mb-1.5";

  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="text-2xl font-bold mb-6">添加课程</h2>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className={labelClass}>课程名称</label>
          <input
            type="text"
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="例如：高等数学"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>星期</label>
            <select
              className={inputClass}
              value={form.day}
              onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}
            >
              {days.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>教师</label>
            <input
              type="text"
              className={inputClass}
              value={form.teacher}
              onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              placeholder="例如：张老师"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>开始时间</label>
            <input
              type="time"
              className={inputClass}
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>结束时间</label>
            <input
              type="time"
              className={inputClass}
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>上课地点</label>
          <input
            type="text"
            className={inputClass}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="例如：教学楼A301"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>起始周</label>
            <input
              type="number"
              className={inputClass}
              min={1}
              max={20}
              value={form.weekStart}
              onChange={(e) => setForm({ ...form, weekStart: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className={labelClass}>结束周</label>
            <input
              type="number"
              className={inputClass}
              min={1}
              max={20}
              value={form.weekEnd}
              onChange={(e) => setForm({ ...form, weekEnd: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>周次类型</label>
          <select
            className={inputClass}
            value={form.weekType}
            onChange={(e) => setForm({ ...form, weekType: e.target.value as "all" | "odd" | "even" })}
          >
            <option value="all">每周</option>
            <option value="odd">单周</option>
            <option value="even">双周</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
        >
          {submitting ? "添加中..." : "添加课程"}
        </button>

        {success && (
          <p className="text-emerald-400 text-sm text-center">课程添加成功！</p>
        )}
      </form>
    </div>
  );
}
