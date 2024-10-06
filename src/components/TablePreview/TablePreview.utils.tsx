import { PartitionResult } from "../../utils/partitioning";

export const getHighlightingClass = (
  team1: Set<unknown>,
  team2: Set<unknown>,
  rowIndex: number,
  colIndex: number
) => {
  // Highlight the cell if both the rowIndex and colIndex are in team1 or team2
  const highlightTeam1 = team1.has(rowIndex) && team1.has(colIndex);
  const highlightTeam2 =
    team2.has(rowIndex) && team2.has(rowIndex) && team2.has(colIndex);

  return highlightTeam1 ? "bg-blue-200" : highlightTeam2 ? "bg-green-200" : "";
};

export const getSets = (
  partitionResult: PartitionResult | null
): { team1: Set<unknown>; team2: Set<unknown> } => {
  const team1 = partitionResult ? new Set(partitionResult.team1) : new Set();

  const team2 = partitionResult ? new Set(partitionResult.team2) : new Set();

  return { team1, team2 };
};
