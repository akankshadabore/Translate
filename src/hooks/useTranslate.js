import { useState } from "react";

const mapToLibreTranslateCode = (lang) => {
  const codes = {
    en: "en",
    hi: "hi",
    fr: "fr",
    es: "es",
    de: "de",
    auto: "auto",
  };
  return codes[lang] || "en";
};

const detectLanguage = async (text) => {
  try {
    const response = await fetch("https://libretranslate.de/detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text }),
    });

    if (!response.ok) throw new Error("Language detection failed");
    const data = await response.json();

    return data[0]?.language || "en";
  } catch (err) {
    console.warn("Detect API failed, defaulting to en");
    return "en";
  }
};

const translateWithMyMemory = async (text, sourceLang, targetLang) => {
  const sourceCode = sourceLang || "en"; // Always pass detected lang
  const langPair = `${sourceCode}|${targetLang}`;

  const response = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${langPair}`
  );

  if (!response.ok) throw new Error("MyMemory API failed");

  const data = await response.json();
  return data.responseData?.translatedText || text;
};

const translateWithLibreTranslate = async (text, sourceLang, targetLang) => {
  const sourceCode = mapToLibreTranslateCode(sourceLang);
  const targetCode = mapToLibreTranslateCode(targetLang);

  const response = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: sourceCode,
      target: targetCode,
      format: "text",
    }),
  });

  if (!response.ok) throw new Error("LibreTranslate API failed");

  const data = await response.json();
  return data.translatedText || text;
};

const translateWithRapidAPI = async (text, sourceLang, targetLang) => {
  const response = await fetch(
    "https://google-translate1.p.rapidapi.com/language/translate/v2",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
        "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
      },
      body: new URLSearchParams({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
      }),
    }
  );

  if (!response.ok) throw new Error("RapidAPI Google Translate failed");

  const data = await response.json();
  return data.data?.translations?.[0]?.translatedText || text;
};

const useTranslate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const translateText = async (text, sourceLang, targetLang) => {
    setLoading(true);
    setError("");

    try {
      if (sourceLang === "auto") {
        sourceLang = await detectLanguage(text);
        console.log("Detected Language:", sourceLang);
      }

      try {
        return await translateWithRapidAPI(text, sourceLang, targetLang);
      } catch (err) {
        console.warn("RapidAPI failed, trying LibreTranslate...");
      }

      try {
        return await translateWithLibreTranslate(text, sourceLang, targetLang);
      } catch (err) {
        console.warn("LibreTranslate failed, trying MyMemory...");
      }

      return await translateWithMyMemory(text, sourceLang, targetLang);
    } catch (err) {
      setError("Translation error: " + err.message);
      return text; // fallback original text
    } finally {
      setLoading(false);
    }
  };

  return { translateText, loading, error };
};

export default useTranslate;


