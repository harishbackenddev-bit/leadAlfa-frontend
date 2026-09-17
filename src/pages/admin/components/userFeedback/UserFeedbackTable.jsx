import React from "react";
import { Eye } from "lucide-react";
import {
  FEEDBACK_STATUS_BADGE_CLASSES,
  FEEDBACK_TYPE_BADGE_CLASSES,
} from "./userFeedbackMappers";

const UserFeedbackTable = ({ rows, loading = false, onView }) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto rounded-2xl min-h-[300px]">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-4 md:px-5">Public ID</th>
              <th className="px-4 py-4 md:px-5">Submitter</th>
              <th className="px-4 py-4 md:px-5">Type</th>
              <th className="px-4 py-4 md:px-5">Description</th>
              <th className="px-4 py-4 md:px-5">Page URL</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-4 py-4 md:px-5">Date</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-gray-700">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-5 py-14 text-center text-sm text-gray-500">
                  Loading user feedback & bug reports...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-14 text-center text-sm text-gray-500">
                  No feedback or bug reports found for current filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.publicId || row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="whitespace-nowrap px-4 py-4 font-mono font-semibold text-gray-900 md:px-5">
                    {row.publicId}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 md:px-5">
                    <div className="font-medium text-gray-900">{row.submitterName}</div>
                    <div className="text-xs text-gray-400">{row.submitterEmail}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 md:px-5">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        FEEDBACK_TYPE_BADGE_CLASSES[row.type] || "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {row.typeLabel}
                    </span>
                  </td>
                  <td className="max-w-[220px] truncate whitespace-nowrap px-4 py-4 text-gray-600 md:px-5" title={row.description}>
                    {row.description}
                  </td>
                  <td className="max-w-[160px] truncate whitespace-nowrap px-4 py-4 font-mono text-xs text-gray-500 md:px-5" title={row.pageUrl}>
                    {row.pageUrl}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        FEEDBACK_STATUS_BADGE_CLASSES[row.status] || "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {row.statusLabel}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-500">{row.date}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-right md:px-5">
                    <button
                      type="button"
                      onClick={() => onView(row)}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserFeedbackTable;
