export interface ParsedCSVResult {
  header?: string[];
  data: number[][];
  rowCount: number;
  columnCount: number;
  error?: string;
}
  