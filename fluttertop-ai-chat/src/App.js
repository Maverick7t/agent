import React, { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, Send, Zap, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* Particle Background — unchanged logic */
const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 150; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 2 + 0.5,
          direction: Math.random() * 2 * Math.PI,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          let newX = p.x + Math.cos(p.direction) * p.speed * 0.1;
          let newY = p.y + Math.sin(p.direction) * p.speed * 0.1;
          if (newX > 100) newX = 0;
          if (newX < 0) newX = 100;
          if (newY > 100) newY = 0;
          if (newY < 0) newY = 100;
          return { ...p, x: newX, y: newY };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-blue-400 rounded-full animate-pulse"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [isHovered, setIsHovered] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // your existing frontend connector state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 180);
    }
  }, [searchOpen]);

  // your existing frontend connector function (unchanged URL and behavior)
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const question = input;
    setInput("");

    try {
      const response = await fetch("https://agent-qj50.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      const botReply = data.answer || data.error || "No response";

      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error connecting to backend." },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background layers */}
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 lg:px-12">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Agentic Ai
        </div>
        <div className="hidden md:flex items-center space-x-8">
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        {!searchOpen && (
          <>
            {/* Central visualization */}
            <div className="relative mb-12">
              <div className="relative w-80 h-80 lg:w-96 lg:h-96 mx-auto">
                <div
                  className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/30 animate-spin"
                  style={{ animationDuration: "20s" }}
                >
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-blue-400 rounded-full"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-160px)`,
                      }}
                    />
                  ))}
                </div>

                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-blue-300">
                      Powered by Deepseek
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Hero text */}
            <div className="max-w-4xl mx-auto space-y-6 mb-12">
              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
                  Your smart
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Work Companion
                </span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Ask. Explore. Discover. Get Things Done.
              </p>
            </div>
          </>
        )}


        {/* Shared layout morph: Button ↔ Search bar */}
        <motion.div layoutId="cta" className="w-full flex justify-center">
          {!searchOpen ? (
            <motion.button
              layout
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setSearchOpen(true)}
              className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-lg font-semibold transition-all duration-500 hover:scale-110 flex items-center gap-2 overflow-hidden"
              whileTap={{ scale: 0.98 }}
            >
              <Search
                className={`w-5 h-5 transition-transform ${isHovered ? "scale-110 rotate-6" : ""
                  }`}
              />
              <span>Search</span>
              <ArrowRight
                className={`w-5 h-5 transition-transform ${isHovered ? "translate-x-1" : ""
                  }`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
            </motion.button>
          ) : (
            <motion.div
              layout
              className="w-full max-w-4xl"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="relative flex bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-2">
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute -top-3 -right-3 p-2 rounded-full bg-white/15 border border-white/20 hover:bg-white/25 transition"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex-1 relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your question here..."
                    className="w-full pl-16 pr-6 py-6 bg-transparent text-white text-lg placeholder-gray-400 outline-none rounded-l-3xl"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl transition-all duration-300 flex items-center justify-center disabled:opacity-100 disabled:cursor-not-allowed hover:scale-105"
                >
                  <Send className="w-6 h-6" />
                  <span className="ml-2 hidden sm:block">Send</span>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Answers below the search area */}
        {searchOpen && (
          <div className="flex flex-col bg-gray-900 rounded-lg p-4 h-[40vh] overflow-y-auto mt-8 w-full max-w-4xl">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-3 ${msg.from === "user" ? "self-end" : "self-start"
                    }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[85%] md:max-w-[70%] break-words ${msg.from === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800 text-gray-100 border border-white/10"
                      }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      {/* Developed by line with spacing */}
      <div className="mb-10 text-gray-400 text-sm text-center w-full">
        Developed and created by Aktar
      </div>
    </div>
  );
}
