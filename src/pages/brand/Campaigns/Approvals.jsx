import React, { useMemo, useState, useCallback } from "react";
import { Table, Tag, Dropdown, Button } from "antd";
import { useNavigate } from "react-router-dom";
import CampaignsSectionShell from "./components/CampaignsSectionShell";
import invitationAvatar from "../../../assets/images/creator/invitation.png";

/** Replace with API hook when backend is ready */
const MOCK_APPROVALS = [
  {
    key: "1",
    applicationId: "APP-1001",
    creatorId: "#12536919",
    creatorName: "Emily Rodriguez",
    avatar: invitationAvatar,
    campaignTitle: "Summer Fashion Collection 2026",
    campaignPublicId: "CMP-B3084F",
    submittedAt: "2026-04-28T10:00:00.000Z",
    status: "pending",
  },
  {
    key: "2",
    applicationId: "APP-1002",
    creatorId: "#12536920",
    creatorName: "Marcus Chen",
    avatar: invitationAvatar,
    campaignTitle: "Spring Skincare Launch",
    campaignPublicId: "CMP-X8092A",
    submittedAt: "2026-04-27T14:30:00.000Z",
    status: "pending",
  },
  {
    key: "3",
    applicationId: "APP-1003",
    creatorId: "#12536921",
    creatorName: "Aisha Khan",
    avatar: invitationAvatar,
    campaignTitle: "Holiday Gift Guide",
    campaignPublicId: "CMP-Q4410Z",
    submittedAt: "2026-04-26T09:15:00.000Z",
    status: "reviewed",
  },
];

function formatSubmitted(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Approvals() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return MOCK_APPROVALS;
    const t = searchTerm.toLowerCase();
    return MOCK_APPROVALS.filter(
      (row) =>
        String(row.creatorName).toLowerCase().includes(t) ||
        String(row.campaignTitle).toLowerCase().includes(t) ||
        String(row.campaignPublicId).toLowerCase().includes(t) ||
        String(row.creatorId).toLowerCase().includes(t) ||
        String(row.applicationId).toLowerCase().includes(t),
    );
  }, [searchTerm]);

  const handleRowAction = useCallback(
    (key, record) => {
      const campaignId = record.campaignPublicId;
      switch (key) {
        case "view":
          navigate(`/brand/campaigns/${campaignId}/view`);
          break;
        case "campaign":
          navigate(`/brand/campaigns/${campaignId}/view`);
          break;
        case "approve":
        case "reject":
        default:
          console.log(key, record);
          break;
      }
    },
    [navigate],
  );

  const columns = [
    {
      title: "Creator",
      key: "creator",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.avatar}
            alt=""
            className="h-9 w-9 rounded-full object-cover"
          />
          <div>
            <div className="text-sm font-medium text-gray-700">
              {record.creatorName}
            </div>
            <div className="text-xs text-[#1E60DB]">{record.creatorId}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Campaign",
      key: "campaign",
      render: (_, record) => (
        <div>
          <div className="text-sm text-gray-800">{record.campaignTitle}</div>
          <button
            type="button"
            className="text-xs text-[#1E60DB] hover:underline"
            onClick={() =>
              navigate(`/brand/campaigns/${record.campaignPublicId}/view`)
            }
          >
            {record.campaignPublicId}
          </button>
        </div>
      ),
    },
    {
      title: "Application",
      dataIndex: "applicationId",
      key: "applicationId",
      render: (id) => <span className="text-xs text-gray-600">{id}</span>,
    },
    {
      title: "Submitted",
      key: "submittedAt",
      render: (_, record) => (
        <span className="text-sm text-gray-600">
          {formatSubmitted(record.submittedAt)}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const pending = record.status === "pending";
        return (
          <Tag color={pending ? "gold" : "green"} className="rounded-full px-2">
            {pending ? "Pending" : "Reviewed"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: "view", label: "View application" },
              { key: "campaign", label: "View campaign" },
              { type: "divider" },
              { key: "approve", label: "Approve" },
              { key: "reject", label: "Reject", danger: true },
            ],
            onClick: ({ key }) => handleRowAction(key, record),
          }}
          trigger={["click"]}
        >
          <Button type="text" className="text-gray-600">
            ⋮
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <CampaignsSectionShell
      subtitle="Review pending creator applications and take action"
      searchPlaceholder="Search by creator, campaign, or ID..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      primaryAction={null}
    >
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="min-w-0 px-2 py-2 md:px-4 md:py-4">
          <Table
            columns={columns}
            dataSource={filtered}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            scroll={{ x: 960 }}
            rowKey="key"
          />
        </div>
      </section>
    </CampaignsSectionShell>
  );
}
