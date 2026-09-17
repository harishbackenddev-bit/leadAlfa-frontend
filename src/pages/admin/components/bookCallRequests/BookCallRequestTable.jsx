import { Eye } from "lucide-react";
import ContactRequestStatusBadge from "../contactRequests/ContactRequestStatusBadge";

const BookCallRequestTable = ({ rows, loading = false, onView }) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white">
      <div className="overflow-x-auto rounded-2xl min-h-[300px]">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-4 md:px-5">Request ID</th>
              <th className="px-4 py-4 md:px-5">Name</th>
              <th className="px-4 py-4 md:px-5">Email</th>
              <th className="px-4 py-4 md:px-5">Company</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-4 py-4 md:px-5">Date</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-gray-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-14 text-center text-sm text-gray-500">
                  Loading call requests...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-14 text-center text-sm text-gray-500">
                  No call requests found for current filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.publicId || row.id}>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-800 md:px-5">
                    {row.publicId}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-800 md:px-5">
                    {row.name}
                  </td>
                  <td className="max-w-[180px] truncate whitespace-nowrap px-4 py-4 text-gray-500 md:max-w-none md:px-5">
                    {row.businessEmail}
                  </td>
                  <td className="max-w-[160px] truncate whitespace-nowrap px-4 py-4 md:max-w-none md:px-5">
                    {row.companyName}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <ContactRequestStatusBadge status={row.status} label={row.statusLabel} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">{row.date}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-right md:px-5">
                    <button
                      type="button"
                      onClick={() => onView(row)}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
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

export default BookCallRequestTable;
