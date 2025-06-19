import { useState, useEffect } from "react";
import axios from "axios";
import { FiSend, FiCopy } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("sportgpt-chat");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    sessionStorage.setItem("sportgpt-chat", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQuestion = question;
    setLoading(true);
    setQuestion("");

    try {
      const res = await axios.post(`${baseURL}/ask`, {
        question: userQuestion,
      });

      const reply = res.data.reply;

      setChatHistory((prev) => [
        ...prev,
        { question: userQuestion, answer: reply, copied: false },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          question: userQuestion,
          answer: "❌ Sorry, something went wrong.",
          copied: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (index, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setChatHistory((prev) =>
        prev.map((chat, i) =>
          i === index ? { ...chat, copied: true } : { ...chat, copied: false },
        ),
      );
    });
  };

  return (
    <section
      className="flex flex-col items-center justify-center text-center text-white py-10 px-6 sm:px-8 md:px-12 transition-all duration-300"
      style={{ background: "transparent" }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
        Ask SportGPT
      </h2>

      <div className="w-full max-w-2xl flex flex-col gap-6 mb-6">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className="bg-black border border-transparent hover:border-yellow-400 rounded-lg p-4 relative text-left transition duration-200"
          >
            <p className="font-semibold mb-1">You: {chat.question}</p>
            <p className="whitespace-pre-line">SportGPT: {chat.answer}</p>

            <button
              onClick={() => handleCopy(index, chat.answer)}
              className="absolute top-3 right-3 flex items-center gap-1 text-sm"
            >
              <FiCopy className="text-lg" />
              {chat.copied ? "Copied!" : "Copy"}
            </button>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl relative flex items-center"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about players, matches, rules..."
          className="w-full bg-black border-2 border-white text-white px-4 py-4 pr-14 rounded-lg focus:outline-none text-lg"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
        >
          {loading ? (
            <ImSpinner8 className="animate-spin text-2xl" />
          ) : (
            <FiSend className="text-2xl" />
          )}
        </button>
      </form>

      <p className="text-sm text-white opacity-70 mt-4 max-w-2xl">
        💡 SportGPT answers general sports questions. Live and recent data may
        not be current — real-time updates will be available soon
      </p>
    </section>
  );
}
