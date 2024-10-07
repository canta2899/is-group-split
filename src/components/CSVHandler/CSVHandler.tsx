import { FaRegArrowAltCircleLeft, FaRegChartBar } from "react-icons/fa"; // Importing icons
import UploadDialog from "../UploadDialog/UploadDialog";
import TablePreview from "../TablePreview/TablePreview";
import { useCsvHandler } from "./CSVHandler.hook";

const CSVHandler = () => {
  const utils = useCsvHandler();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {utils.showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-2 rounded-lg shadow-lg m-auto sm:min-w-[35rem]">
            <UploadDialog
              onUpload={utils.handleUpload}
              errorMessage={utils.csvResult?.error}
            />
          </div>
        </div>
      )}{" "}
      {!utils.showModal && utils.csvResult && (
        <div className="w-full flex flex-col">
          <div className="w-full bg-white shadow-lg p-6 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-col items-start text-xl">
              <button
                className="mt-2 flex gap-2 items-center text-gray-600 hover:text-gray-900 transition duration-200"
                onClick={utils.handleGoBack}
              >
                <FaRegArrowAltCircleLeft className="mr-1" />
                Go Back
              </button>
            </div>

            <div className="flex flex-col">
              {!utils.partitionResult ? (
                <div>
                  <div className="font-semibold text-center">
                    Number of members:{" "}
                    <span className="font-normal">
                      {utils.csvResult.rowCount}
                    </span>
                  </div>
                  <div className="text-gray-600 text-center">
                    Run the procedure to get result
                  </div>

                  {utils.isBigMatrix && (
                    <div className="text-sm text-center mt-3 md:max-w-sm text-gray-500 font-light">
                      The matrix size is big and cannot computed using the
                      standard procedure. A poorly tested heuristic will be used
                      and probably the result will be incorrect.
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold">Teams</h3>
                  <p className="font-medium">
                    Team 1: {utils.partitionResult.team1.join(", ")}
                  </p>
                  <p className="font-medium">
                    Team 2: {utils.partitionResult.team2.join(", ")}
                  </p>
                </div>
              )}
              <div className="mx-auto">
                <button
                  onClick={utils.partitionGroups}
                  className="mt-4 p-2 bg-blue-600 text-white rounded transition duration-200 hover:bg-blue-700 flex items-center"
                >
                  {utils.isLoadingResult ? (
                    "Loading..."
                  ) : (
                    <>
                      <FaRegChartBar className="mr-1" />
                      {!utils.partitionResult
                        ? "Run Procedure"
                        : "Re-Run Procedure"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <TablePreview
              csvResult={utils.csvResult}
              partitionResult={utils.partitionResult}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVHandler;
