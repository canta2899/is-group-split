import { ParsedCSVResult } from "@/utils/csv";
import { PartitionResult } from "@/utils/partitioning";

export interface TablePreviewProps {
  csvResult: ParsedCSVResult;
  partitionResult: PartitionResult | null;
}