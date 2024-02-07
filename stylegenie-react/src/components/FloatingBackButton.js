import React from "react";
import store from "../store";

export default function FloatingBackButton() {
  const { setReviseCount, setResp, setQueryResp, setMainPrompt, setPrompt } = store();

  return (
    <div class="fixed bottom-4 right-4">
        <button
          type="button"
          class="me-2 inline-flex items-center rounded-full border-none p-2.5 text-center text-sm text-white focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            setQueryResp(null);
            setResp(null);
            setReviseCount(0);
            setMainPrompt("");
            setPrompt("");
            return;
          }}
        >
          <svg className="w-12 h-12 rotate-180 text-gray-500 dark:text-gray-400 text-center" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 50 50">
            <rect x="0.5" width="40" height="40" rx="100" fill="#E7E5E4"/>
            <path transform="translate(10,10)" d="M9 10H19M19 10L16 7M19 10L16 13M5 10C5 10.5304 4.78932 11.0391 4.41421 11.4142C4.03911 11.7893 3.53043 12 3 12C2.46957 12 1.96089 11.7893 1.58579 11.4142C1.21068 11.0391 1 10.5304 1 10C1 9.46957 1.21068 8.96089 1.58579 8.58579C1.96089 8.21068 2.46957 8 3 8C3.53043 8 4.03911 8.21068 4.41421 8.58579C4.78932 8.96089 5 9.46957 5 10Z" stroke="#292524" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span class="sr-only">Icon description</span>
        </button>
      </div>
  );
}
