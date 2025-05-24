"use client";
import EditName from "@/components/EditName";
import EditProfilePic from "@/components/EditProfilePic";
import PageWrapper from "@/components/PageWrapper";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function EditProfilePage() {
  const searchParams = useSearchParams();
  const edit = searchParams.get("edit");

  if (edit === "profilePic")
    return (
      <PageWrapper>
        <EditProfilePic />
      </PageWrapper>
    );
  return (
    <PageWrapper>
      <EditName />
    </PageWrapper>
  );
}
