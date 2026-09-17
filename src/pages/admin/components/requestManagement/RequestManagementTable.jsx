import { useMemo } from "react";
import { Button, Dropdown, Table } from "antd";
import {
  CheckCircle2,
  Eye,
  Mail,
  MoreVertical,
  Trash2,
  XCircle,
} from "lucide-react";

const statusClassMap = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-600",
  clarification_requested: "bg-blue-100 text-blue-700",
};

const terminalStatuses = new Set(["approved", "rejected"]);

const formatStatus = (value) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const buildMenuItems = (status) => {
  const isTerminalStatus = terminalStatuses.has(String(status || "").toLowerCase());

  const items = [
    { key: "view", label: "View Details", icon: <Eye className="h-4 w-4" /> },
  ];

  if (!isTerminalStatus) {
    items.push(
      { type: "divider" },
      {
        key: "approve",
        label: "Approve",
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
      },
      {
        key: "reject",
        label: "Reject",
        icon: <XCircle className="h-4 w-4" />,
        danger: true,
      },
      {
        key: "send-email",
        label: "Request Info",
        icon: <Mail className="h-4 w-4" />,
      }
    );
  }

  items.push(
    { type: "divider" },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      danger: true,
    }
  );

  return items;
};

const RequestManagementTable = ({
  rows,
  onAction,
  loading = false,
  actionLoadingId = null,
}) => {
  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 180,
        ellipsis: true,
        render: (name) => <span className="font-medium text-gray-800">{name}</span>,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 240,
        ellipsis: true,
        render: (email) => <span className="text-gray-500">{email}</span>,
      },
      {
        title: "Country",
        dataIndex: "country",
        key: "country",
        width: 150,
        ellipsis: true,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 160,
        render: (status) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClassMap[status] || "bg-gray-100 text-gray-700"}`}
          >
            {formatStatus(status)}
          </span>
        ),
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: 130,
        render: (date) => <span className="text-gray-500">{date}</span>,
      },
      {
        title: "Action",
        key: "action",
        fixed: "right",
        width: 96,
        align: "center",
        render: (_, record) => {
          if (actionLoadingId === record.id) {
            return <span className="text-xs text-gray-500">Processing...</span>;
          }

          return (
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              menu={{
                items: buildMenuItems(record.status),
                onClick: ({ key, domEvent }) => {
                  domEvent?.stopPropagation();
                  onAction(key, record);
                },
              }}
            >
              <Button
                type="text"
                aria-label="Open request actions"
                className="inline-flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-100"
                icon={<MoreVertical className="h-4 w-4" />}
                onClick={(event) => event.stopPropagation()}
              />
            </Dropdown>
          );
        },
      },
    ],
    [actionLoadingId, onAction]
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="min-w-0 px-2 py-2 md:px-4 md:py-4">
        <Table
          columns={columns}
          dataSource={rows}
          loading={loading}
          rowKey="id"
          pagination={false}
          scroll={{ x: 980 }}
          locale={{
            emptyText: loading ? "Loading requests..." : "No requests found for current filters.",
          }}
        />
      </div>
    </section>
  );
};

export default RequestManagementTable;
