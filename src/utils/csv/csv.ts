import { CSVContent, CSVHeader, ParsedCSVResult } from "./types";

/**
 * Main function to parse CSV text and return a structured result.
 * @param csvText - The CSV text to parse.
 * @param hasHeader - Indicates if the first row contains headers.
 * @param delimiter - The character used to separate values in a row.
 * @param lineSeparator - The character used to separate lines in the CSV.
 * @returns A ParsedCSVResult object containing headers, data, row count, column count, or an error message.
 */
export const parseCSV = (
  csvText: string,
  hasHeader: boolean,
  delimiter: string,
  lineSeparator: string
): ParsedCSVResult => {
  // Step 1: Split CSV text into lines
  const lines = splitLines(csvText, lineSeparator);
  if (!lines.length) {
    return errorResult('Empty CSV file.');
  }

  // Step 2: Split lines into raw rows
  const rawRows = splitRows(lines, delimiter);
  if (!rawRows.length) {
    return errorResult('Invalid CSV format.');
  }

  // Step 3: Separate headers (if applicable)
  const { headers, dataRows } = processHeader(rawRows, hasHeader);

  // Step 4: Validate and convert the remaining data to numbers
  try {
    const data = parseDataRows(dataRows);
    
    // Step 5: Check for square matrix
    if (!isSquareMatrix(data)) {
      return errorResult('The CSV does not represent a square matrix. Maybe you need to enable/disable headers?');
    }

    return createParsedResult(headers, data);
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : 'Error while handling the CSV file';
    return errorResult(errorMsg);
  }
};

/**
 * Splits the CSV text into lines based on the provided line separator.
 * @param csvText - The CSV text to split.
 * @param lineSeparator - The character used to separate lines in the CSV.
 * @returns An array of trimmed lines from the CSV.
 */
const splitLines = (csvText: string, lineSeparator: string): string[] => {
  return csvText
    .split(lineSeparator)
    .map(line => line.trim())
    .filter(line => line.length > 0);  // Remove empty lines
};

/**
 * Splits each line into values based on the delimiter.
 * @param lines - An array of lines from the CSV.
 * @param delimiter - The character used to separate values in a row.
 * @returns A 2D array of trimmed string values.
 */
const splitRows = (lines: string[], delimiter: string): string[][] => {
  return lines.map(line => line.split(delimiter).map(value => value.trim()));
};

/**
 * Processes the header row if present and returns the headers and remaining data rows.
 * @param rows - A 2D array of raw string values from the CSV.
 * @param hasHeader - Indicates if the first row contains headers.
 * @returns An object containing headers (if present) and data rows.
 */
const processHeader = (rows: string[][], hasHeader: boolean): { headers?: string[], dataRows: string[][] } => {
  if (hasHeader) {
    const headers = rows[0];
    const dataRows = rows.slice(1); // Exclude header row
    return { headers, dataRows };
  }
  return { headers: undefined, dataRows: rows };
};

/**
 * Parses the data rows, converting values to numbers and validating them.
 * @param rows - A 2D array of string values from the CSV.
 * @returns A 2D array of numbers after parsing.
 * @throws An error if any value cannot be parsed as a number.
 */
const parseDataRows = (rows: string[][]): number[][] => {
  return rows.map(row => {
    console.log("parsing row", row)
    return row.map(value => {
      const num = parseFloat(value);
      if (isNaN(num)) {
        throw new Error(`Invalid number: ${value}`);
      }
      return num;
    });
  });
};

/**
 * Checks if the provided data represents a square matrix.
 * @param data - A 2D array of numbers to check.
 * @returns True if the data represents a square matrix; otherwise, false.
 */
const isSquareMatrix = (data: number[][]): boolean => {
  const rowCount = data.length;
  return data.every(row => row.length === rowCount);
};

/**
 * Creates a result object after successfully parsing the CSV.
 * @param headers - The headers extracted from the CSV (if applicable).
 * @param data - The parsed data as a 2D array of numbers.
 * @returns A ParsedCSVResult object containing the headers, data, row count, and column count.
 */
const createParsedResult = (headers: CSVHeader, data: CSVContent): ParsedCSVResult => {
  const rowCount = data.length;
  const columnCount = data[0]?.length || 0;

  return { header: headers, data, rowCount, columnCount };
};

/**
 * Helper function to create an error result.
 * @param message - The error message to include in the result.
 * @returns A ParsedCSVResult object with an error message.
 */
const errorResult = (message: string): ParsedCSVResult => {
  return { data: [], rowCount: 0, columnCount: 0, error: message };
};

export default parseCSV;
