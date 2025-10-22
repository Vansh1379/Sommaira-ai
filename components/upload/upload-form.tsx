"use client";
import React from "react";
import UploadFormInput from "./upload-form-input";

export default function UploadForm() {
  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handelSubmit} />
    </div>
  );
}
