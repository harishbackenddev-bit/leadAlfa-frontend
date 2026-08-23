import React, { useState, useMemo } from "react";
import { Dropdown, Table } from "antd";
import {
  PaginationLeftIcon,
  PaginationRightIcon,
} from "../../../../assets/SVGs/brands/customSVGs";

// Table Empty Placeholder Component
const TablePlaceholder = ({
  title = "No Campaigns Found",
  description = "There are no campaigns to display at the moment.",
  icon = "📋",
  actionText,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 text-center max-w-md mb-6">
        {description}
      </p>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

const statusClass = (status) => {
  switch (status) {
    case "Active":
      return "text-green-700 bg-green-100";
    case "Inactive":
      return "text-amber-700 bg-amber-100";
    case "Closed":
      return "text-red-700 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const capitalize = (s) => {
  if (!s) return "";
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
};

const formatSpend = (campaign) => {
  const min = campaign?.minBudget;
  const max = campaign?.maxBudget;
  if (campaign?.compensationType?.toLowerCase() === "gift") return "Gift";
  if (min && max) return `R ${min} - R ${max}`;
  if (min) return `R ${min}`;
  return "-";
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Pagination = ({ total, page, perPage, onChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pages = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (page <= 3) {
      for (let i = 1; i <= maxVisible; i++) pages.push(i);
    } else if (page >= totalPages - 2) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++)
        pages.push(i);
    } else {
      for (let i = page - 2; i <= page + 2; i++) pages.push(i);
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 py-6 border-t border-gray-100">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
          page === 1
            ? "text-gray-300 cursor-not-allowed"
            : "hover:bg-gray-100 text-gray-500"
        }`}
      >
        <PaginationLeftIcon />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            page === p
              ? "bg-[#1E84D6] text-white"
              : "hover:bg-gray-100 border border-gray-200 text-gray-600"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
          page === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "hover:bg-gray-100 text-gray-500"
        }`}
      >
        <PaginationRightIcon />
      </button>
    </div>
  );
};

const CampaignsTable = ({
  campaigns = [],
  onRowClick,
  itemsPerPage = 9,
  controlledPage, // optional controlled page
  onPageChange, // optional controlled change handler
  totalCount, // optional total count for controlled pagination
  emptyPlaceholder, // optional custom placeholder props
  onRowHover, // optional: (campaignId) => void, used to prefetch campaign detail
  onRowLeave, // optional: (campaignId) => void, to cancel prefetch
  onAction,
  loading = false,
  /** When true, table sits inside a parent card (no extra border/radius). */
  embedded = false,
}) => {
  const [internalPage, setInternalPage] = useState(1);
  const page = controlledPage ?? internalPage;
  const total = totalCount ?? campaigns.length;

  const handleChange = (p) => {
    if (onPageChange) {
      onPageChange(p);
    } else {
      setInternalPage(p);
    }
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const visible = useMemo(() => {
    // If totalCount provided, assume `campaigns` is the current page slice
    if (totalCount) return campaigns;
    return campaigns.slice(startIndex, endIndex);
  }, [campaigns, startIndex, endIndex, totalCount]);

  const shellClass = embedded
    ? "w-full min-w-0 overflow-hidden"
    : "w-full min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white";

  // Show placeholder if no campaigns
  if (!loading && (total === 0 || visible.length === 0)) {
    return (
      <div className={shellClass}>
        <TablePlaceholder {...emptyPlaceholder} />
      </div>
    );
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "publicId",
      key: "publicId",
      render: (_, record) => (
        <span className="text-xs text-gray-600">{record.publicId || record.id}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "campaignTitle",
      key: "campaignTitle",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={
              record?.media?.coverImage?.mediaDetails?.url ||
              record?.media?.coverImage?.url ||
              record.image ||
              ""
            }
            alt={record?.campaignTitle || record.name || "campaign"}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-900">
            {record.campaignTitle || record.name}
          </span>
        </div>
      ),
    },
    {
      title: "Total Spend",
      key: "totalSpend",
      render: (_, record) => (
        <span className="text-sm font-medium text-gray-700">{formatSpend(record)}</span>
      ),
    },
    {
      title: "Start Date",
      key: "startDate",
      render: (_, record) => (
        <span className="text-sm text-gray-600">
          {formatDate(record.campaignStarts || record.createdAt)}
        </span>
      ),
    },
    {
      title: "Total Creators",
      key: "totalCreators",
      render: (_, record) => (
        <span className="text-sm text-gray-600">
          {record.numberOfCreators ?? record.totalCreators ?? "0"} Creators
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const label = capitalize(record.status);
        return (
          <span
            className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium ${statusClass(
              label
            )}`}
          >
            {label || "-"}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              { key: "view", label: "View" },
              { key: "edit", label: "Edit" },              
              { key: "delete", label: "Delete" },
            ],
            onClick: ({ key, domEvent }) => {
              domEvent?.stopPropagation();
              onAction && onAction(key, record);
            },
          }}
        >
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
            onClick={(event) => event.stopPropagation()}
            aria-label="Open campaign actions"
          >
            ⋮
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className={shellClass}>
      <Table
        columns={columns}
        dataSource={visible}
        loading={loading}
        pagination={false}
        rowKey={(record) => String(record.publicId || record.id)}
        scroll={{ x: 980 }}
        onRow={(record) => ({
          onClick: () => onRowClick && onRowClick(record.publicId || record.id),
          onMouseEnter: () => onRowHover && onRowHover(record.publicId || record.id),
          onMouseLeave: () => onRowLeave && onRowLeave(record.publicId || record.id),
        })}
        locale={{
          emptyText: <TablePlaceholder {...emptyPlaceholder} />,
        }}
      />

      <Pagination
        total={total}
        page={page}
        perPage={itemsPerPage}
        onChange={handleChange}
      />
    </div>
  );
};

export default CampaignsTable;
