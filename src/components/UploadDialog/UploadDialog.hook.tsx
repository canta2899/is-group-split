import { useState } from "react";
import { OnUploadCallback } from "./types";

export const useUploadDialog = (onUpload: OnUploadCallback) => {
  const [file, setFile] = useState<File | null>(null);
  const [hasHeader, setHasHeader] = useState(true);
  const [delimiter, setDelimiter] = useState(",");
  const [lineSeparator, setLineSeparator] = useState("\n");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      onUpload(file, hasHeader, delimiter, lineSeparator);
    }
  };

  return {
    file,
    hasHeader,
    setHasHeader,
    delimiter,
    setDelimiter,
    lineSeparator,
    setLineSeparator,
    handleFileChange,
    handleSubmit,
  };
};
