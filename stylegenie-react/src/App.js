import React from "react";
import { Analytics } from "@vercel/analytics/react";
import Form from "./components/Form";
import Result from "./components/Result";
import store from "./store";
import PromptBar from "./components/PromptBar";
import QueryResult from "./components/QueryResult";
import FloatingBackButton from "./components/FloatingBackButton";
import DragAndDropImage from "./components/DragAndDropImage";

function App() {
  const { resp, queryResp, aiSupport, setAiSupport, file } = store();
  

  return (
    <main className="mx-auto flex h-screen max-w-6xl flex-col bg-stone-100 px-10 pt-20 text-center">
      
      {!queryResp && (
        <h1 className="mx-auto w-8/12 bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-2xl font-bold text-transparent">
          {resp ? "Continue styling adding new instructions or if it looks perfect click on Find Store" : "Find Similar Clothes by Uploading Image of Your Cloth or Generating one with AI"}
        </h1>
      )}

      {!aiSupport && !file && !queryResp && (
        <DragAndDropImage />
      )}
      
      {!aiSupport && !file && !queryResp && (
        <p onClick={() => setAiSupport(true)} className="text-gray-500 text-sm mt-5 cursor-pointer hover:text-gray-900">
          If you don't have an image, you can still use the AI by typing your request.
        </p>
      )}

      {aiSupport && !queryResp && <Form />}

      {queryResp && <PromptBar />}

      {(file || resp) && !queryResp && <Result />}

      {queryResp && <QueryResult />}

      <FloatingBackButton />

      <Analytics />
    </main>
  );
}

export default App;
