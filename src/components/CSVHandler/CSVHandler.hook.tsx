import { parseCSV, ParsedCSVResult } from "../../utils/csv";
import Partition, { PartitionResult } from "../../utils/partitioning";
import { useCallback, useState } from "react";

export const useCsvHandler = () => {
  const [csvResult, setCsvResult] = useState<ParsedCSVResult | null>(null);
  const [showModal, setShowModal] = useState(true);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [partitionResult, setPartitionResult] =
    useState<PartitionResult | null>(null);

  /**
   * Parsing text file as CSV
   */
  const handleUpload = useCallback(
    (
      file: File,
      hasHeader: boolean,
      delimiter: string,
      lineSeparator: string
    ) => {
      const reader = new FileReader();
      reader.onload = () => {
        const csvText = reader.result as string;
        const result = parseCSV(csvText, hasHeader, delimiter, lineSeparator);

        setCsvResult(result);
        setShowModal(result.error !== undefined);
      };
      reader.readAsText(file);
    },
    [setCsvResult, setShowModal]
  );

  /**
   * Restores initial state
   */
  const handleGoBack = useCallback(() => {
    setCsvResult(null);
    setShowModal(true);
    setPartitionResult(null); // Reset partition result when going back
  }, [setCsvResult, setShowModal, setPartitionResult]);

  /**
   *  Partitions CSV data in groups
   */
  const partitionGroups = useCallback(() => {
    setIsLoadingResult(true);
    if (csvResult) {
      const { data } = csvResult;
      const result = Partition.calculateRatings(data);
      setPartitionResult(result);
    }
    setIsLoadingResult(false);
  }, [csvResult, setPartitionResult]);

  return {
    csvResult,
    setCsvResult,
    showModal,
    setShowModal,
    isLoadingResult,
    setIsLoadingResult,
    partitionResult,
    setPartitionResult,
    partitionGroups,
    handleGoBack,
    handleUpload,
  };
};
