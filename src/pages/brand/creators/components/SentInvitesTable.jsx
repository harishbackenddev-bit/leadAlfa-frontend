import React from "react";
import { Dropdown, Table } from "antd";
import {
  PaginationLeftIcon,
  PaginationRightIcon,
} from "../../../../assets/SVGs/brands/customSVGs";

const statusClass = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "pending":
      return "border-amber-300 bg-amber-50 text-amber-700";
    case "accepted":
      return "border-emerald-300 bg-emerald-50 text-emerald-700";
    case "declined":
      return "border-red-300 bg-red-50 text-red-700";
    default:
      return "border-gray-300 bg-gray-50 text-gray-600";
  }
};

function CreatorAvatar({ name, avatar, initials }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="h-9 w-9 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0353A4] to-[#4b96e3] text-xs font-semibold text-white"
      aria-hidden
    >
      {initials || String(name || "C").charAt(0).toUpperCase()}
    </span>
  );
}

function TablePagination({ totalItems, totalPages, page, perPage, onChange }) {
  const pages = [];
  const safeTotal = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotal);
  const maxVisible = 5;

  if (safeTotal <= maxVisible) {
    for (let i = 1; i <= safeTotal; i++) pages.push(i);
  } else if (safePage <= 3) {
    for (let i = 1; i <= maxVisible; i++) pages.push(i);
  } else if (safePage >= safeTotal - 2) {
    for (let i = safeTotal - maxVisible + 1; i <= safeTotal; i++) pages.push(i);
  } else {
    for (let i = safePage - 2; i <= safePage + 2; i++) pages.push(i);
  }

  if (totalItems <= 0) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-gray-600">
        Showing{" "}
        <span className="font-medium">
          {totalItems === 0 ? 0 : Math.min((safePage - 1) * perPage + 1, totalItems)}
        </span>{" "}
        of <span className="font-medium">{totalItems}</span> invites
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, safePage - 1))}
          disabled={safePage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg disabled:opacity-40"
          aria-label="Previous page"
        >
          <PaginationLeftIcon />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
              safePage === p
                ? "bg-[#1E84D6] text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(Math.min(safeTotal, safePage + 1))}
          disabled={safePage === safeTotal}
          className="flex h-8 w-8 items-center justify-center rounded-lg disabled:opacity-40"
          aria-label="Next page"
        >
          <PaginationRightIcon />
        </button>
      </div>
    </div>
  );
}

const buildMenuItems = (status) => {
  const items = [];
  if (status === "pending") {
    items.push({ key: "withdraw", label: "Withdraw Invite", danger: true });
  }
  return items;
};

export default function SentInvitesTable({
  invitations = [],
  currentPage = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 10,
  isLoading = false,
  isProcessing = false,
  onPageChange,
  onAction,
}) {
  const columns = [
    {
      title: "ID",
      dataIndex: "publicId",
      key: "publicId",
      render: (id) => (
        <span className="cursor-pointer text-sm font-medium text-[#0c7bb3]">
          {id || "—"}
        </span>
      ),
    },
    {
      title: "Creator",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex min-w-[180px] items-center gap-3">
          <CreatorAvatar
            name={record.name}
            avatar={record.avatar}
            initials={record.initials}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {record.name}
            </p>
            {record.handle ? (
              <p className="truncate text-xs text-gray-500">{record.handle}</p>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      title: "Campaign",
      dataIndex: "campaignTitle",
      key: "campaignTitle",
      render: (title) => (
        <span className="text-sm text-gray-700">{title || "—"}</span>
      ),
    },
    {
      title: "Pricing",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => (
        <span className="text-sm font-medium text-gray-900">{price}</span>
      ),
    },
    {
      title: "Sent Date",
      dataIndex: "inviteSent",
      key: "inviteSent",
      render: (date) => <span className="text-sm text-gray-600">{date}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <span
          className={`inline-flex rounded-md border px-3 py-1 text-xs font-medium ${statusClass(record.status)}`}
        >
          {record.statusLabel}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const items = buildMenuItems(record.status);
        if (items.length === 0) {
          return <span className="text-sm text-gray-300">—</span>;
        }
        return (
          <Dropdown
            trigger={["click"]}
            disabled={isProcessing}
            menu={{
              items,
              onClick: ({ key, domEvent }) => {
                domEvent?.stopPropagation();
                onAction?.(key, record);
              },
            }}
          >
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              aria-label="Invite actions"
              disabled={isProcessing}
              onClick={(e) => e.stopPropagation()}
            >
              ⋮
            </button>
          </Dropdown>
        );
      },
    },
  ];

  const resolvedTotal =
    typeof totalItems === "number" ? totalItems : invitations.length;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <Table
        columns={columns}
        dataSource={invitations}
        pagination={false}
        rowKey={(record) => record.publicId || record.id}
        scroll={{ x: 980 }}
        loading={isLoading}
        locale={{
          emptyText:
            "No invitations sent. Go to your Campaign details and select creators to invite.",
        }}
      />
      <TablePagination
        totalItems={resolvedTotal}
        totalPages={totalPages}
        page={currentPage}
        perPage={itemsPerPage}
        onChange={(p) => onPageChange?.(p)}
      />
    </div>
  );
}
