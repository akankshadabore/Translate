import { useState } from "react";
import TextArea from "./components/TextArea";
import Dropdown, { languages } from "./components/Dropdown";
import Button from "./components/Button";
import useTranslate from "./hooks/useTranslate";
import { MdGTranslate } from "react-icons/md";
import { RiSwapBoxLine } from "react-icons/ri";
import { AiOutlineClear } from "react-icons/ai";
import { FaRegCopy } from "react-icons/fa6";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto"); 
  const [targetLang, setTargetLang] = useState("hi");   
  const [copied, setCopied] = useState(false); 

  const { translateText, loading, error } = useTranslate();

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text to translate");
      return;
    }
    
    if (sourceLang === targetLang && sourceLang !== "auto") {
      alert("Source and target languages cannot be the same");
      return;
    }
    
    const result = await translateText(inputText, sourceLang, targetLang);
    if (result) {
      setTranslatedText(result);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang === "auto") {
      alert("Cannot swap when source language is set to 'Auto Detect'");
      return;
    }
    
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    
    if (translatedText) {
      setInputText(translatedText);
      setTranslatedText(inputText);
    }
  };

  const clearAll = () => {
    setInputText("");
    setTranslatedText("");
  };

  const getSourceLanguageName = () => {
    if (sourceLang === "auto") return "Auto Detect";
    const lang = languages.find(l => l.code === sourceLang);
    return lang ? lang.label : "Unknown";
  };

  const getTargetLanguageName = () => {
    const lang = languages.find(l => l.code === targetLang);
    return lang ? lang.label : "Unknown";
  };

  return (
    <div className="min-h-screen flex items-center justify-center md:bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="md:w-full md:max-w-4xl md:bg-white md:rounded-3xl md:shadow-2xl md:p-8 space-y-6 md:border border-gray-100">
      
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-4xl font-bold text-indigo-500">
             Universal AI Translator
          </h1>
          <p className="text-gray-600">Translate between any languages with AI power</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From (Source Language)
              </label>
              <Dropdown 
                value={sourceLang} 
                onChange={setSourceLang}
                includeAutoDetect={true}
                placeholder="Select source language"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter text to translate
              </label>
              <TextArea
                value={inputText}
                onChange={setInputText}
                placeholder={`Type your text in ${getSourceLanguageName()}...`}
              />
              {inputText && (
                <div className="absolute top-8 right-3 text-xs text-gray-400">
                  {inputText.length} characters
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To (Target Language)
              </label>
              <Dropdown 
                value={targetLang} 
                onChange={setTargetLang}
                includeAutoDetect={false}
                placeholder="Select target language"
                excludeValue={sourceLang === "auto" ? null : sourceLang}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Translation Result
              </label>
              {translatedText ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 min-h-[140px]">
                  <div className="flex items-center justify-between mb-2 relative">
                    <span className="text-sm font-medium text-green-800">
                      ✨ Translated to {getTargetLanguageName()}
                    </span>
                    <div className="relative">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(translatedText);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1500); 
                        }}
                        className="text-green-600 hover:text-green-800 text-sm font-medium hover:underline"
                        title="Copy to clipboard"
                      >
                        <FaRegCopy />
                      </button>
                      {copied && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded-md shadow-lg animate-fadeIn">
                          Copied
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-lg text-gray-800 leading-relaxed">{translatedText}</p>
                </div>
              ) : (
                <div className="border-2 border-gray-200 border-dashed rounded-xl p-4 min-h-[140px] flex items-center justify-center">
                  <p className="text-gray-400 text-center">
                    Translation will appear here...
                    <br />
                    <span className="text-sm">Enter text and click translate</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button 
            onClick={handleTranslate} 
            disabled={loading || !inputText.trim()}
            variant="primary"
            className="min-w-[140px]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Translating...
              </span>
            ) : (
              <div className="flex gap-1"><MdGTranslate className="text-lg"/> Translate</div>
            )}
          </Button>

          <Button 
            onClick={handleSwapLanguages}
            disabled={loading || sourceLang === "auto" || !inputText.trim()}
            variant="secondary"
            title="Swap languages and text"
          >
           <div className="flex gap-1"> <RiSwapBoxLine className="text-lg"/> Swap Languages</div>
          </Button>
          
          {(inputText || translatedText) && (
            <Button 
              onClick={clearAll} 
              variant="secondary"
              disabled={loading}
            >
              <div className="flex gap-1"><AiOutlineClear className="text-lg"/> Clear All</div>
            </Button>
          )}
        </div>

        {inputText && (
          <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            <span className="font-medium">Translation:</span> {getSourceLanguageName()} → {getTargetLanguageName()}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-700 text-sm font-medium">Translation Error</p>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        <div className="text-center text-xs text-gray-500 pt-4 border-t">
          Powered by AI Translation • Support for 50+ Languages • Built with React
        </div>
      </div>
    </div>
  );
}

