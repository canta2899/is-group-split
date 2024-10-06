export interface UploadDialogProps {
  onUpload: OnUploadCallback;
  errorMessage?: string | null;
}

export type OnUploadCallback = (
    file: File,
    hasHeader: boolean,
    delimiter: string,
    lineSeparator: string
  ) => void;