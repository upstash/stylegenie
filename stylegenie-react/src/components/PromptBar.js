import React from "react";
import store from "../store";
import img from "../assets/logo192.png";

export default function PromptBar() {
  const { resp,file,  mainPrompt } = store();

  return (
    <div className="w-full h-12 relative bg-white border flex rounded-lg dark:bg-white-800">
        <div className="h-6 w-6 absolute flex end-2 bottom-2">
        {resp?.image_url && <img className="object-fill rounded-2xl" src={resp.image_url} alt="product" />}
        {file && <img className="object-fill rounded-2xl" src={URL.createObjectURL(file)} alt="product" />}
        </div>
        <div 
          className="h-6 w-6 absolute flex bottom-2 left-2">
          <img className="object-fill rounded-2xl" src={img} alt="product" />
        </div>
        <div className="px-5 py-5">
          <p>{mainPrompt}</p>
        </div>
    </div>
  );
}
