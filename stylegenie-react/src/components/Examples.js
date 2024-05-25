import React from "react";
import img1 from "../assets/puffer.jpeg";
import img2 from "../assets/dress.jpeg";
import img3 from "../assets/jeans.jpeg";
import store from "../store";

export default function Examples() {
  const { setFile, fetchQueryData, setLoading } = store();

  async function queryWithImage(e) {
    setLoading(true);
    e.preventDefault();
    //image to blob
    await fetch(e.target.src)
      .then((res) => res.blob())
      .then((blob) => {
        setFile(blob);
      });

    return fetchQueryData();
  }

  return (
    <div className="mt-5">
      <h1 className="mx-auto w-6/12 bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-xl font-bold text-transparent">
        Examples
      </h1>
      <div className="mt-5 grid grid-cols-1 place-items-center items-center justify-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="dark:bg-white-800 min-w-sm max-w-sm rounded-3xl border">
          <img
            loading="lazy"
            className="h-96 w-full cursor-pointer rounded-3xl p-5"
            src={img1}
            alt="model"
            onClick={queryWithImage}
          />
        </div>
        <div className="dark:bg-white-800 min-w-sm max-w-sm cursor-pointer rounded-3xl border">
          <img
            loading="lazy"
            className="h-96 w-full rounded-3xl p-5"
            src={img2}
            alt="sweater"
            onClick={queryWithImage}
          />
        </div>
        <div className="dark:bg-white-800 min-w-sm max-w-sm cursor-pointer rounded-3xl  border">
          <img
            loading="lazy"
            className="h-96 w-full rounded-3xl p-5"
            src={img3}
            alt="jeans"
            onClick={queryWithImage}
          />
        </div>
      </div>
    </div>
  );
}
