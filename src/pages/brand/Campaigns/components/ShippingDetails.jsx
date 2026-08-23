import shippingName from "../../../../assets/images/brands/Macbook.png";

const mockRows = [
  {
    id: "#12345645",
    name: "Macbook Air M1",
    sku: "WH-0001",
    qty: "1 Quantity",
    date: "14 July 2025",
    status: "In-Transit",
  },
  {
    id: "#12345645",
    name: "Macbook Air M1",
    sku: "WH-0001",
    qty: "1 Quantity",
    date: "14 July 2025",
    status: "In-Transit",
  },
  {
    id: "#12345645",
    name: "Macbook Air M1",
    sku: "WH-0001",
    qty: "1 Quantity",
    date: "14 July 2025",
    status: "In-Transit",
  },
];

export default function ShippingDetails({
  rows = mockRows,
  noContainer = false,
}) {
  const inner = (
    <div>
      <h3 className="text-2xl font-extrabold font-anton mb-4">
        Shipping Details
      </h3>

      <div className="overflow-x-auto">
        <div className="min-w-[800px] border-2 border-gray-200 rounded-t-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-gray-500 divide-y divide-gray-400 bg-gray-50">
                <th className="py-3 px-4 first:rounded-tl-lg">ID</th>
                <th className="py-3 px-4">Shipping Name</th>
                <th className="py-3 px-4">SKU ID</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Delivering Date</th>
                <th className="py-3 px-4 last:rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-400">
              {rows.map((r, idx) => (
                <tr key={idx}>
                  <td className="py-4 px-4"><a href="#" className="text-blue-600">{r.id}</a></td>
                  <td className="py-4 px-4 flex items-center gap-2">
                    <img src={shippingName} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                    <span className="text-sm text-gray-700">{r.name}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{r.sku}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{r.qty}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{r.date}</td>
                  <td className="py-4 px-4">
                    <button className="px-4 py-2 border border-blue-400 bg-blue-50 text-blue-700 rounded-md">{r.status}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (noContainer) return <div className="py-6">{inner}</div>;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
      {inner}
    </div>
  );
}
