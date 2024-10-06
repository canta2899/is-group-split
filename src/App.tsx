import React from "react";
import CSVUploader from "./components/CSVUploader/CSVUploader";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <CSVUploader />
    </div>
  );
};

export default App;
