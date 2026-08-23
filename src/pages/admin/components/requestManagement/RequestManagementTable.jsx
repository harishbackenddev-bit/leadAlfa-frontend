import RequestActionMenu from "./RequestActionMenu";

const statusClassMap = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-600",
  clarification_requested: "bg-blue-100 text-blue-700",
};

const formatStatus = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const RequestManagementTable = ({
  rows,
  openMenuId,
  onToggleMenu,
  onAction,
  loading = false,
  actionLoadingId = null,
}) => {
  return (
    <section className="border border-gray-200 bg-white rounded-2xl ">
      <div className="overflow-y-visible overflow-x-auto rounded-2xl min-h-[300px]">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-4 md:px-5">Name</th>
              <th className="px-4 py-4 md:px-5">Email</th>
              <th className="px-4 py-4 md:px-5">Country</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-4 py-4 md:px-5">Date</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-gray-700">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-5 py-14 text-center text-sm text-gray-500">
                  Loading requests...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-14 text-center text-sm text-gray-500">
                  No requests found for current filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-800 md:px-5">{row.name}</td>
                  <td className="max-w-[170px] truncate whitespace-nowrap px-4 py-4 text-gray-500 md:max-w-none md:px-5">{row.email}</td>
                  <td className="whitespace-nowrap px-5 py-4">{row.country}</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClassMap[row.status]}`}
                    >
                      {formatStatus(row.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">{row.date}</td>
                  <td className="relative whitespace-nowrap px-4 py-4 text-right md:px-5">
                    {actionLoadingId === row.id ? (
                      <span className="text-xs text-gray-500">Processing...</span>
                    ) : (
                      <RequestActionMenu
                        isOpen={openMenuId === row.id}
                        onToggle={() => onToggleMenu(row.id)}
                        onAction={(action) => onAction(action, row)}
                        status={row.status}
                      />
                    )}
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

export default RequestManagementTable;
