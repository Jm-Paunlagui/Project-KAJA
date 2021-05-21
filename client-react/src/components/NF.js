import React from "react";
import { useHistory } from "react-router-dom";

export default function NF() {
  let history = useHistory();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center overflow-hidden">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-6xl xl:text-9xl font-extrabold">404</h1>
        <p className="text-3xl xl:text-6xl font-extrabold">oh no! page not found</p>
        <button
          onClick={() => {
            history.push("/");
          }}
          className="mt-16 tracking-wide font-semibold bg-indigo-500 text-white w-48 py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i className="fas fa-home w-6-ml-2" />
          <span className="ml-3 text-center">Go to Main Page</span>
        </button>
      </div>
    </div>
  );
}
