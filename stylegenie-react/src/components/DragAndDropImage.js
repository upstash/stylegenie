import React from "react";
import {useDropzone} from 'react-dropzone';
import store from "../store";

export default function DragAndDropImage() {
  const { setFile } = store();

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1, 
    onDropAccepted: (files) => {
      setFile(files[0]);
    }
  });

  return (
    <section className="container mx-auto p-6">  
      <div {...getRootProps({className: 'dropzone flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-12 text-center hover:bg-gray-100 hover:border-gray-300 transition-colors'})} >
        <input {...getInputProps()} />
        <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
        <p className="text-gray-600 pt-2">Drag 'n' drop an image here, or click to select an image</p>
      </div>
    </section>
  );
}