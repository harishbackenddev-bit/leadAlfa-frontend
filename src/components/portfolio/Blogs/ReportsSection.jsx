import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const reports = [
  { id: 1, title: "Report 1", image: "/img1.jpg" },
  { id: 2, title: "Report 2", image: "/img2.jpg" },
  { id: 3, title: "Report 3", image: "/img3.jpg" },
  { id: 4, title: "Report 4", image: "/img4.jpg" },
  { id: 5, title: "Report 5", image: "/img5.jpg" },
];

export default function ReportsSection() {
  const [page, setPage] = useState(0);
  const perPage = 2; // 2 on desktop
  const totalPages = Math.ceil(reports.length / perPage);

  const currentReports = reports.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="h-[80vh] overflow-hidden flex flex-col justify-between">
      {/* Scrollable cards with animation */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="grid gap-4 sm:grid-cols-1 md:grid-cols-2"
          >
            {currentReports.map((r) => (
              <div
                key={r.id}
                className="p-4 border rounded-lg bg-white shadow-sm"
              >
                <img src={r.image} alt={r.title} className="rounded-md mb-2" />
                <h3 className="font-semibold">{r.title}</h3>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 py-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`w-3 h-3 rounded-full ${
              page === i ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
