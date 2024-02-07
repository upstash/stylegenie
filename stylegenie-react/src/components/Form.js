import React from "react";
import store from "../store";
import { IconLoader3 } from "@tabler/icons-react";

export default function Form() {
  const {
    loading,
    prompt,
    resp,
    gender,
    setGender,
    reviseList,
    setPrompt,
    setReviseList,
    fetchData,
    reviseCount,
  } = store();

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleRemovePrompt = (index) => {
    return () => {
      if (reviseCount >= 11) {
        setPrompt("");
        alert("You can only revise 5 times");
        return;
      }
      const newList = reviseList.filter((_, i) => i !== index);
      setReviseList(newList);
      fetchData();
    };
  };

  return (
    <div>
      <form
        name="prompt-form"
        id="prompt-form"
        className="mx-auto mt-10 grid max-w-md gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (reviseList.length >= 5 || reviseCount >= 11) {
            setPrompt("");
            alert("Revise limit reached.");
          } else {
            return fetchData();
          }
        }}
      >
        <div className="relative">
          <div
            className={`absolute bottom-0 end-2 flex items-center ${
              loading
                ? "animate-pulse cursor-wait"
                : "animate-bounce cursor-pointer hover:animate-none"
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (reviseList.length >= 5 || reviseCount >= 11) {
                setPrompt("");
                alert("Revise limit reached.");
              } else {
                return fetchData();
              }
            }}
          >
            <svg
              className="h-8 w-8 text-center text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 50 50"
            >
              <rect x="0.5" width="40" height="40" rx="100" fill="#E7E5E4" />
              <path
                transform="translate(10,10)"
                d="M9 10H19M19 10L16 7M19 10L16 13M5 10C5 10.5304 4.78932 11.0391 4.41421 11.4142C4.03911 11.7893 3.53043 12 3 12C2.46957 12 1.96089 11.7893 1.58579 11.4142C1.21068 11.0391 1 10.5304 1 10C1 9.46957 1.21068 8.96089 1.58579 8.58579C1.96089 8.21068 2.46957 8 3 8C3.53043 8 4.03911 8.21068 4.41421 8.58579C4.78932 8.96089 5 9.46957 5 10Z"
                stroke="#292524"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <input
            disabled={loading}
            type="text"
            id="prompt"
            value={prompt}
            onChange={handlePromptChange}
            autoFocus={true}
            className="order-none box-border flex w-full flex-none flex-grow-0 flex-row items-center justify-center rounded-full text-sm font-medium not-italic leading-5 text-gray-900"
            placeholder={
              resp
                ? "Make it blue"
                : "Woolen sweater in burgundy for a cozy winter"
            }
            required
          />
        </div>

        {reviseList && (
          <div className="mx-auto flex max-w-sm flex-wrap items-center justify-center">
            {reviseList.map((prompt, index) => (
              <div
                className={`m-1 flex items-center justify-center rounded-full border bg-stone-800  px-2 py-1 font-medium text-white hover:bg-stone-600`}
              >
                <div className="max-w-full flex-initial text-xs font-normal leading-none">
                  {prompt}
                </div>
                <div
                  className={`flex flex-auto flex-row-reverse ${
                    loading || reviseCount >= 11
                      ? "cursor-no-drop"
                      : "cursor-pointer"
                  }`}
                  onClick={handleRemovePrompt(index)}
                >
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="100%"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-x ml-2 h-4 w-4 rounded-full hover:text-indigo-400"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!resp && (
          <div className="flex flex-row items-center justify-center">
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              className="order-none mr-2 box-border flex-none flex-grow-0 items-center justify-center rounded-full text-sm font-medium not-italic leading-5 text-orange-500 "
              checked={gender === "male"}
              onChange={handleGenderChange}
            />
            <label htmlFor="male">Male</label>
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              className="order-none mx-2 box-border flex-none flex-grow-0 items-center justify-center rounded-full text-sm font-medium not-italic leading-5 text-orange-500"
              checked={gender === "female"}
              onChange={handleGenderChange}
            />
            <label htmlFor="female">Female</label>
          </div>
        )}

        {loading && (
          <div className="mb-5 grid place-items-center">
            <IconLoader3
              stroke={1.5}
              className="animate-spin text-orange-500"
            />
          </div>
        )}
      </form>
    </div>
  );
}
