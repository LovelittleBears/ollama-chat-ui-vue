import { Ollama } from "ollama/browser";
const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })
export function chatWithHistory(model, userMsg, history, systemMsg) {
  return ollama.chat({
    model,
    messages: [
      { role: "system", content: systemMsg },
      ...history,
      { role: "user", content: userMsg },
    ],
    stream: true,
  });
}

export function chat(model, userMsg, systemMsg) {
  return ollama.chat({
    model,
    messages: [
      { role: "system", content: systemMsg },
      { role: "user", content: userMsg },
    ],
    stream: true,
  });
}

export function listModels() {
  return ollama.list();
}

export function abort() {
  ollama.abort();
}
