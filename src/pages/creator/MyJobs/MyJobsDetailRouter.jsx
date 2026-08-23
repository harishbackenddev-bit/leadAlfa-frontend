import React from "react";
import { useParams } from "react-router-dom";
import JobDetailView from "./JobDetailView";

export default function MyJobsDetailRouter() {
  const { id } = useParams();
  return <JobDetailView key={id} />;
}
