"use client";

import { useState } from "react";

const ACTION_LABELS = {
  summary: "О чем статья?",
  тезисы: "Тезисы",
  telegram: "Пост для Telegram",
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [activeAction, setActiveAction] = useState(null);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (actionKey) => {
    setActiveAction(actionKey);
    if (!url.trim()) {
      setResult("Сначала введите ссылку на англоязычную статью.");
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        setResult(data.error || "Не удалось обработать статью.");
        return;
      }

      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult("Ошибка сети при загрузке статьи.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Референт - переводчик с ИИ-обработкой
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Введите URL англоязычной статьи для анализа
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form
            className="space-y-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <div>
              <label
                htmlFor="article-url"
                className="text-xs font-semibold uppercase tracking-wide text-slate-600"
              >
                URL статьи
              </label>
              <input
                id="article-url"
                name="article-url"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-slate-700">
                Выберите действие:
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => handleAction("summary")}
                  disabled={isLoading}
                  className={`h-10 w-full rounded-lg px-4 text-sm font-semibold text-white shadow-sm transition ${
                    activeAction === "summary"
                      ? "bg-blue-600 ring-2 ring-blue-200"
                      : "bg-blue-500 hover:bg-blue-400"
                  }`}
                >
                  {ACTION_LABELS.summary}
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("тезисы")}
                  disabled={isLoading}
                  className={`h-10 w-full rounded-lg px-4 text-sm font-semibold text-white shadow-sm transition ${
                    activeAction === "тезисы"
                      ? "bg-emerald-600 ring-2 ring-emerald-200"
                      : "bg-emerald-500 hover:bg-emerald-400"
                  }`}
                >
                  {ACTION_LABELS.тезисы}
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("telegram")}
                  disabled={isLoading}
                  className={`h-10 w-full rounded-lg px-4 text-sm font-semibold text-white shadow-sm transition ${
                    activeAction === "telegram"
                      ? "bg-purple-600 ring-2 ring-purple-200"
                      : "bg-purple-500 hover:bg-purple-400"
                  }`}
                >
                  {ACTION_LABELS.telegram}
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-slate-700">Результат:</div>
          <div className="mt-3 min-h-[120px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            {isLoading ? (
              <div className="text-center text-slate-400">
                Загрузка и разбор статьи...
              </div>
            ) : result ? (
              <pre className="whitespace-pre-wrap break-words font-mono text-xs">
                {result}
              </pre>
            ) : (
              <div className="text-center text-slate-400">
                Результат появится здесь после выбора действия.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
