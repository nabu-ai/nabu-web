"use client";
const nabuTranslator = require("nabu-translator/src");
import { useMeetingStore } from "@/store/useMeetingStore";
import { useEffect, useState } from "react";
import {
  languagesMap
} from "@/constants/languages";

export default function TranslatorUI() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const meetingInfo = useMeetingStore((s) => s.meetingInfo);
  const languagesMapOptions = {
    ...{ "": "-- Select --" },
    ...languagesMap,
  };


  useEffect(() => {
    if(targetLanguage !== "" && inputText?.trim() !== ""){
      handleTranslate()
    }
  }, [targetLanguage])

  const handleTranslate = () => {
    setOutputText("")
    if(sourceLanguage === "" && targetLanguage === ""){
      return alert("Please select source language and target language")
    }
    if(sourceLanguage === "" && targetLanguage !== ""){
      return alert("Please select source language")
    }
    if(sourceLanguage !== "" && targetLanguage === ""){
      return alert("Please select target language")
    }

    if(inputText?.trim() === ""){
      return alert("Please input text to translate")
    }
    
    translateText()
  };

  const translateText = () => {
    const { translate } = nabuTranslator;
    
    const options = {
      text: inputText.trim(),
      sourceLanguage,
      targetLanguage,
      onProcessed: (data) => {
        const { translation } = data;
        setOutputText(translation)
      },
      onError: (data) => {
        console.log("Error:::", data);
      },
    };

    translate(options);
  }

  return (<>
      <header className="bg-white shadow-md">
      <div className="container mx-5 flex justify-between items-center">
        <a href="/nabu-web/" >
        <img className="h-20" src="/nabu-web/Nabu-Logo.jpg"></img>
      </a>
     </div>
     </header>
    <div className="flex w-full h-[calc(100vh-90px)] p-4 bg-gray-100 gap-4">
      
      {/* Left Box */}
      <div className="w-1/2 bg-white p-6 rounded-2xl shadow flex flex-col">
        <div className="flex justify-between items-center mb-4">
          Source Language: <select
            value={sourceLanguage}
            onChange={(e) => {setSourceLanguage(e.target.value); setInputText("")} }
            className="p-2 border rounded-md"
          >
            {Object.keys(languagesMapOptions).map((languageCode) => (
              <option key={languageCode} value={languageCode}>
                {languagesMapOptions[languageCode]} {/* Display the language name */}
              </option>
            ))}
          </select>
          <button
            onClick={handleTranslate}
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
          >
            Translate
          </button>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 resize-none p-3 border rounded-md"
          placeholder="Enter text to translate..."
        />
      </div>

      {/* Right Box */}
      <div className="w-1/2 bg-white p-6 rounded-2xl shadow flex flex-col">
        <div className="flex items-center justify-between mb-4">
          Target Language: <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="p-2 border rounded-md"
          >
           {Object.keys(languagesMapOptions).map((languageCode) => (
              <option key={languageCode} value={languageCode}>
                {languagesMapOptions[languageCode]} {/* Display the language name */}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={outputText}
          readOnly
          className="flex-1 resize-none p-3 border rounded-md bg-gray-50 text-gray-700"
          placeholder="Translated text..."
        />
      </div>
    </div>
    </>
  );
}
