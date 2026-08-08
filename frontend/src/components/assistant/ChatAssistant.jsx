import { useEffect, useRef, useState } from "react";
import { useApplication } from "../../context/ApplicationContext";
import { sendChat } from "../../api/assistant";

const SUGGESTIONS = [
  "What's my risk score?",
  "Why was this decision made?",
  "Is there any fraud risk?",
  "Which data sources were used?",
];

const WELCOME =
  "Hi! I'm the TrustFlow AI underwriting assistant. Ask me about your " +
  "risk score, the approval decision, fraud screening, why the score " +
  "was given, or which data sources were used.";

function ChatMessage({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 font-body-md text-body-md whitespace-pre-line ${
          isUser
            ? "bg-primary text-on-primary-container rounded-br-sm"
            : "bg-surface-container-highest text-on-surface rounded-bl-sm border border-outline-variant/20"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default function ChatAssistant() {
  const { applicationId } = useApplication();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: WELCOME },
  ]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  const handleSend = async (text) => {
    const question = (text ?? input).trim();
    if (!question || typing) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setTyping(true);
    try {
      const { reply } = await sendChat(question, applicationId);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            err?.response?.data?.detail ||
            "Sorry, I couldn't reach the assistant right now. Please try again.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-on-primary-container flex items-center justify-center shadow-[0_8px_30px_rgba(107,216,203,0.4)] hover:bg-primary-fixed transition-colors"
        aria-label="Open AI assistant"
      >
        <span className="material-symbols-outlined filled text-2xl">
          {open ? "close" : "chat"}
        </span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl overflow-hidden border border-outline-variant/30 shadow-2xl bg-surface-container-low">
          <div className="flex items-center gap-sm px-md py-sm bg-surface-container-high border-b border-outline-variant/20">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary-container text-sm">
                auto_awesome
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                TrustFlow AI Assistant
              </h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant leading-tight">
                Underwriting · Fraud · Explainability · Data
              </p>
            </div>
            <span className="flex items-center gap-1 font-label-sm text-label-sm text-[#4ade80]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
              Online
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-md py-md space-y-sm">
            {messages.map((m, i) => (
              <ChatMessage key={i} role={m.role} text={m.text} />
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-surface-container-highest border border-outline-variant/20 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-on-surface-variant animate-bounce"></span>
                  <span
                    className="w-2 h-2 rounded-full bg-on-surface-variant animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  ></span>
                  <span
                    className="w-2 h-2 rounded-full bg-on-surface-variant animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  ></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-md pb-sm flex flex-wrap gap-xs">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="font-label-sm text-label-sm text-primary bg-primary-container/10 border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary-container/20 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="px-md py-sm border-t border-outline-variant/20 flex items-center gap-sm">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                applicationId
                  ? "Ask about this application..."
                  : "Complete an application first, or ask general questions..."
              }
              className="input-base !py-2.5"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || typing}
              className="w-10 h-10 rounded-lg bg-primary text-on-primary-container flex items-center justify-center disabled:opacity-40 hover:bg-primary-fixed transition-colors shrink-0"
              aria-label="Send"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
