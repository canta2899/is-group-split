import { parseCSV, ParsedCSVResult } from "../../utils/csv";
import Partition, { PartitionResult } from "../../utils/partitioning";
import { useCallback, useState } from "react";

export const useCsvHandler = () => {
  const [csvResult, setCsvResult] = useState<ParsedCSVResult | null>(null);
  const [showModal, setShowModal] = useState(true);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [isBigMatrix, setIsBixMatrix] = useState(false);
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
        setIsBixMatrix(result.data.length > 23);
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
  const partitionGroups = useCallback(async () => {
    if (csvResult) {
      setIsLoadingResult(true);
      const { data } = csvResult;
      const result = await Partition.calculateRatings(data);
      setIsLoadingResult(false);
      setPartitionResult(result);
    }
  }, [csvResult, setPartitionResult]);

  return {
    csvResult,
    showModal,
    isLoadingResult,
    partitionResult,
    partitionGroups,
    handleGoBack,
    handleUpload,
    isBigMatrix,
  };
};
