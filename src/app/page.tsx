"use client";

import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import styles from "./page.module.scss";

const FORMATS = [
  { value: "CODE128", label: "CODE128 (일반 텍스트/숫자)" },
  { value: "CODE39", label: "CODE39" },
  { value: "EAN13", label: "EAN-13 (12~13자리 숫자)" },
  { value: "EAN8", label: "EAN-8 (7~8자리 숫자)" },
  { value: "UPC", label: "UPC (11~12자리 숫자)" },
  { value: "ITF14", label: "ITF-14 (13~14자리 숫자)" },
  { value: "MSI", label: "MSI" },
  { value: "pharmacode", label: "Pharmacode" },
  { value: "codabar", label: "Codabar" },
];

export default function Home() {
  const [value, setValue] = useState("1234567890");
  const [format, setFormat] = useState("CODE128");
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    if (!value) {
      setError("값을 입력해주세요.");
      svgRef.current.innerHTML = "";
      return;
    }
    try {
      JsBarcode(svgRef.current, value, {
        format,
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
  }, [value, format]);

  const handleDownload = () => {
    if (!svgRef.current || error) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `barcode-${value}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-black flex items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-xl flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            바코드 생성기
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
              placeholder="바코드로 변환할 값"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="format">포맷</label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              {FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className={`${styles.preview} ${error ? styles.error : ""}`}>
            {error ? <span>{error}</span> : <svg ref={svgRef} />}
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!!error}
            className={styles.downloadBtn}
          >
            SVG로 다운로드
          </button>
        </section>

        <footer className="text-center text-xs text-zinc-500 dark:text-zinc-500">
          Built with Next.js · Tailwind · SCSS Modules
        </footer>
      </main>
    </div>
  );
}
