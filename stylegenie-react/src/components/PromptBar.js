import React from "react";
import store from "../store";

export default function PromptBar() {
  const { resp,file,  mainPrompt } = store();

  return (
    <div className="w-full relative bg-white border rounded-lg dark:bg-white-800">
        <div className="h-12 w-12 absolute flex end-2 bottom-2">
        {resp?.image_url && <img className="object-fill rounded-2xl" src={resp.image_url} alt="product" />}
        {file && <img className="object-fill rounded-2xl" src={URL.createObjectURL(file)} alt="product" />}
        </div>
        <div 
          className="h-10 w-10 absolute flex bottom-2.5">
          <span className="h-24 w-24 text-3xl">🧞‍♂️</span>
        </div>
        <div className="px-5 py-5">
          <p>{mainPrompt}</p>
        </div>
    </div>
  );
}
