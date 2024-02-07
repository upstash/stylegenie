import React from "react";
import store from "../store";

export default function QueryResult() {
  const { queryResp } = store();

  let capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-5 m-5">
      {queryResp.result.map((result) => (
        <div className=" dark:bg-white-800 rounded-lg bg-white">
          <div className="p-0">
            <img
              className="h-9/12 rounded-3xl object-fill p-3"
              src={result.metadata.image}
              alt="product"
            />
          </div>
          <div className="grid grid-cols-2 my-3 items-center justify-start">
            <div className="mt-4 px-4 items-start justify-start text-left">
              <p className="text-sm text-gray-500">Brand: {capitalizeFirstLetter(result.metadata.brand)}</p>
              <p className="text-sm text-gray-500">Category: {capitalizeFirstLetter(result.metadata.category)}</p>
              <p className="text-sm text-gray-500">Gender: {capitalizeFirstLetter(result.metadata.gender)}</p>
            </div>
            <div>
              <a
                className="rounded-full bg-stone-800 px-3 py-2 font-bold text-white no-underline hover:bg-stone-600 focus:outline-none focus:ring-4"
                href={result.metadata.url}
                target="_blank"
                rel="noreferrer"
              >
                Buy now!
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
