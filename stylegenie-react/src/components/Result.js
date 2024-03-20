import React, { useState } from "react";
import store from "../store";
import { IconLoader3 } from "@tabler/icons-react";

export default function Result() {
  const { resp, loading, fetchQueryData, file, setGenderFilter } = store();

  const [gender, setGender] = useState("woman"); 


  const handleGenderChange = () => {
    if (gender === "woman") {
      setGender("man");
      setGenderFilter("man"); 
    } else {
      setGender("woman")
      setGenderFilter("woman"); 
    }
  };

  return (
    <div>
      <div className="mt-5 flex items-center justify-center">
        <div className="dark:bg-white-800 min-w-sm max-w-sm rounded-3xl border bg-white">
          {resp?.image_url && (
            <img
              loading="lazy"
              className="w-5/6 rounded-3xl p-5"
              src={resp.image_url}
              alt="product"
            />
          )}
          {file && (
            <img
              loading="lazy"
              className="w-5/6 rounded-3xl p-5"
              src={URL.createObjectURL(file)}
              alt="product"
            />
          )}
          <div className="mx-auto justify-center pb-5 relative flex flex-row">
            <div>
              <button
                className="rounded-full border-gray-100 text-xl hover:bg-gray-300 bg-gray-100 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                defaultValue={"woman"}
                onClick={handleGenderChange}
                disabled={loading}
              >
                {gender === "woman" ? "👩🏻  🔁" : "👨🏻  🔁"}
              </button>
            </div>

            <div className="ml-3">
            <button
              className={`${
                loading ? "cursor-wait" : "animate-pulse cursor-pointer"
              } relative rounded-full bg-stone-800 text-xl px-5 py-2 font-bold text-white hover:bg-stone-600`}
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                return fetchQueryData();
              }}
            >
              <span className="text-lg">
              Find in store!
              </span>
            </button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="my-5 grid place-items-center">
          <IconLoader3 stroke={1.5} className="animate-spin text-orange-500" />
        </div>
      )}
    </div>
  );
}
