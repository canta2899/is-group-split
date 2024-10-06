import React from "react";
import { getHighlightingClass, getSets } from "./TablePreview.utils";
import { TablePreviewProps } from "./types";

const TablePreview: React.FC<TablePreviewProps> = ({
  csvResult,
  partitionResult,
}) => {
  const { data, header } = csvResult;

  const { team1, team2 } = getSets(partitionResult);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {header &&
              header.map((h, i) => (
                <th key={i} className="border border-gray-300 p-2">
                  {h}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => {
                // Highlight the cell if both the rowIndex and colIndex are in team1 or team2
                const bgColor = getHighlightingClass(
                  team1,
                  team2,
                  rowIndex,
                  colIndex
                );

                return (
                  <td
                    key={colIndex}
                    className={`border border-gray-300 p-2 ${bgColor}`}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePreview;
