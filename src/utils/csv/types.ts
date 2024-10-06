export interface ParsedCSVResult {
  header?: string[];
  data: number[][];
  rowCount: number;
  columnCount: number;
  error?: string;
}
  
export type CSVHeader = string[] | undefined;
export type CSVContent = number[][];