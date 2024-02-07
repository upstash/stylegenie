import React from "react";
import { Analytics } from "@vercel/analytics/react";
import Form from "./components/Form";
import Result from "./components/Result";
import store from "./store";
import PromptBar from "./components/PromptBar";
import QueryResult from "./components/QueryResult";
import FloatingBackButton from "./components/FloatingBackButton";

function App() {
  const { resp, queryResp } = store();

  return (
    <main className="mx-auto flex h-screen max-w-6xl flex-col bg-stone-100 px-10 pt-20 text-center">
      {!queryResp && (
        <h1 className="mx-auto w-8/12 bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-2xl font-bold text-transparent">
          Describe the clothing you want, including the occasion, style, colors,
          patterns, specific garments, and any preferred materials or features.
        </h1>
      )}

      {!queryResp && <Form />}

      {queryResp && <PromptBar />}

      {resp && !queryResp && <Result />}

      {queryResp && <QueryResult />}

      <FloatingBackButton />

      <Analytics />
    </main>
  );
}

export default App;
