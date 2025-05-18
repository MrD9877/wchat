"use client";
import EditName from "@/components/EditName";
import EditProfilePic from "@/components/EditProfilePic";
import Loading from "@/components/Loading";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function EditProfilePage() {
  const searchParams = useSearchParams();
  const edit = searchParams.get("edit");
  const [loading, setLoading] = useState(false);

  if (loading) return <Loading />;
  if (edit === "profilePic") return <EditProfilePic setLoading={setLoading} />;
  return <EditName setLoading={setLoading} />;
}
