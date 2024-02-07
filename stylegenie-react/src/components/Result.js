import React from "react";
import store from "../store";

export default function Result() {
  const { resp, loading, fetchQueryData } = store();

  return (
    <div className="flex items-center justify-center mt-5">
      <div className="dark:bg-white-800 min-w-sm max-w-sm rounded-3xl border bg-white">
        <img loading="lazy" className="rounded-3xl w-5/6 p-5" src={resp.image_url} alt="product" />
        <div className="px-5 pb-5">
          <button
            className="animate-pulse w-full rounded-full bg-stone-800 px-5 py-2 font-bold text-white hover:bg-stone-600"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              return fetchQueryData();
            }}
          >
            Find in store!
          </button>
        </div>
      </div>
    </div>
  );
}
