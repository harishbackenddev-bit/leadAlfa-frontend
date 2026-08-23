import React, { useState } from "react";

export default function AvailabilityContent() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 9)); // June 9, 2025
  const [viewMode, setViewMode] = useState("Month");

  // Sample events data
  const events = [
    { date: "2025-05-30", time: "13:00", duration: "60 min", color: "green" },
    { date: "2025-06-08", time: "9:00", duration: "2 hours", color: "green" },
    { date: "2025-06-08", time: "13:00", duration: "60 min", color: "green" },
    { date: "2025-06-11", time: "13:00", duration: "info here", color: "blue" },
    {
      date: "2025-06-11",
      time: "13:00",
      duration: "info here",
      color: "green",
    },
    { date: "2025-06-17", time: "21:00", duration: "30 min", color: "blue" },
    {
      date: "2025-06-18",
      time: "13:00",
      duration: "text here",
      color: "green",
    },
    { date: "2025-06-18", time: "19:00", duration: "60 min", color: "blue" },
    { date: "2025-06-21", time: "13:00", duration: "info here", color: "blue" },
    { date: "2025-06-21", time: "13:00", duration: "info here", color: "blue" },
    { date: "2025-06-24", time: "13:00", duration: "60 min", color: "green" },
  ];

  const viewModes = ["Month", "Week", "Day", "List"];
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const getMonthYear = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    let startDay = firstDay.getDay();
    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    startDay = startDay === 0 ? 6 : startDay - 1;

    const days = [];

    // Add days from previous month
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: `${year}-${String(month).padStart(2, "0")}-${String(
          prevMonthDays - i
        ).padStart(2, "0")}`,
      });
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: `${year}-${String(month + 1).padStart(2, "0")}-${String(
          i
        ).padStart(2, "0")}`,
      });
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: `${year}-${String(month + 2).padStart(2, "0")}-${String(
          i
        ).padStart(2, "0")}`,
      });
    }

    return days;
  };

  const getEventsForDate = (dateStr) => {
    return events.filter((event) => event.date === dateStr);
  };

  const isToday = (dayObj) => {
    const today = new Date(2025, 5, 9); // June 9, 2025 as "today"
    const checkDate = new Date(dayObj.date);
    return (
      dayObj.isCurrentMonth &&
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-medium text-gray-900">
          {getMonthYear()}
        </h2>

        {/* View Mode Buttons */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {viewModes.map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                viewMode === mode
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 bg-white border-b border-gray-200">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-medium text-gray-500 border-r border-gray-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((dayObj, index) => {
            const dayEvents = getEventsForDate(dayObj.date);
            const isTodayDate = isToday(dayObj);

            return (
              <div
                key={index}
                className={`min-h-[100px] sm:min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0 ${
                  isTodayDate ? "bg-blue-50 border-2 border-blue-300" : ""
                } ${!dayObj.isCurrentMonth ? "bg-gray-50" : "bg-white"}`}
              >
                <span
                  className={`text-sm sm:text-base font-medium ${
                    dayObj.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                  } ${isTodayDate ? "text-[#0c7bb3]" : ""}`}
                >
                  {dayObj.day}
                </span>

                {/* Events */}
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`px-2 py-1 text-xs text-white rounded truncate ${
                        event.color === "green" ? "bg-green-500" : "bg-blue-500"
                      }`}
                    >
                      {event.time} ({event.duration})
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
