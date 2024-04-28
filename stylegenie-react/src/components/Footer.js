import React from "react";

export default function Footer() {
  return (
    <footer class="my-12 space-y-2 py-16 text-center text-zinc-700 dark:text-zinc-400">
    <p>
        Built using{" "}
        <a
            class="underline text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300"
            href="https://openai.com"
            target="_blank" rel="noreferrer"
        >
            OpenAI
        </a>
        ,
        {" "}
        <a
            class="underline text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300"
            href="http://upstash.com"
            target="_blank" rel="noreferrer"
        >
            Upstash Vector
        </a>
        ,
        {" "}
        <a
            class="underline text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300"
            href="http://fly.io/"
            target="_blank" rel="noreferrer"
        >
            Fly.io
        </a>
        {" "}
        and
        {" "}
        <a
            class="underline text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300"
            href="http://vercel.com"
            target="_blank" rel="noreferrer"
        >
            Vercel
        </a>
        .
    </p>
    <p>
        <a
            class="underline text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300"
            href="https://github.com/upstash/stylegenie"
            target="_blank" rel="noreferrer"
        >
            Source Code on GitHub
        </a>
    </p>
</footer>

  );
}
