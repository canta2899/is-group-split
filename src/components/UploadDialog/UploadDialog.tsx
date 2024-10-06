import React from "react";
import { FaFileUpload } from "react-icons/fa"; // Importing file upload icon
import { FiDivideSquare } from "react-icons/fi";
import { UploadDialogProps } from "./types";
import { useUploadDialog } from "./UploadDialog.hook";

const UploadDialog: React.FC<UploadDialogProps> = ({
  onUpload,
  errorMessage,
}) => {
  const utils = useUploadDialog(onUpload);

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="text-3xl font-bold mb-10 flex flex-col items-center justify-center w-full gap-3">
        <FiDivideSquare /> The Partitioner
      </div>
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <FaFileUpload className="mr-2 text-blue-600" />
        Upload CSV File
      </h2>

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 border border-red-400 rounded">
          {errorMessage}
        </div>
      )}

      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={utils.handleFileChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="mb-4 flex items-center text-sm">
        <input
          type="checkbox"
          checked={utils.hasHeader}
          onChange={(e) => utils.setHasHeader(e.target.checked)}
          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="text-gray-700">Has Header</label>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Delimiter:</label>
        <select
          value={utils.delimiter}
          onChange={(e) => utils.setDelimiter(e.target.value)}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value=",">Comma (,)</option>
          <option value=";">Semicolon (;)</option>
          <option value=" ">Space ( )</option>
          <option value="\\n">Newline (\n)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Line Separator:</label>
        <select
          value={utils.lineSeparator}
          onChange={(e) => utils.setLineSeparator(e.target.value)}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="\\n">Newline (\n)</option>
          <option value=";">Semicolon (;)</option>
          <option value=",">Comma (,)</option>
          <option value=" ">Space ( )</option>
        </select>
      </div>

      <button
        className={`w-full ${
          !utils.file ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"
        } text-white px-4 py-2 rounded  transition duration-200`}
        disabled={!utils.file}
        onClick={utils.handleSubmit}
      >
        Upload
      </button>
    </div>
  );
};

export default UploadDialog;
