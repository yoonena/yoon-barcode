"use client";

import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import styles from "./page.module.scss";

export default function Home() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    if (!value) {
      setError(null);
      svgRef.current.innerHTML = "";
      return;
    }
    try {
      JsBarcode(svgRef.current, value, {
        format: "CODE128",
        displayValue: true,
        margin: 10,
        height: 100,
        fontSize: 16,
      });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "바코드를 생성할 수 없습니다.");
      svgRef.current.innerHTML = "";
    }
  }, [value]);

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-black flex items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-xl flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-snug text-zinc-900 dark:text-zinc-50">
            김종민이 만들라고 해서 만든<br />
            <span className="text-blue-500">바코드 생성기</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            값을 입력하면 실시간으로 바코드가 생성됩니다.
          </p>
        </header>

        <section className={styles.card}>
          <div className={styles.field}>
            <label htmlFor="value">값</label>
            <input
              id="value"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>

          <div className={`${styles.preview} ${error ? styles.error : ""}`}>
            <svg ref={svgRef} style={{ display: error ? "none" : undefined }} />
            {error && <span>{error}</span>}
          </div>
        </section>

        <footer className="text-center text-xs text-zinc-500 dark:text-zinc-500">
          광고 없다 나한테 고마워 하셈
        </footer>
      </main>
    </div>
  );
}
