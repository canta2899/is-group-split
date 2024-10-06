export interface UploadDialogProps {
  onUpload: OnUploadCallback;
  errorMessage?: string | null; // New prop for error message
}

export type OnUploadCallback = (
    file: File,
    hasHeader: boolean,
    delimiter: string,
    lineSeparator: string
  ) => void;