"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import styles from "./page.module.scss";

type Barcode = { id: string; value: string };

type CardProps = {
  barcode: Barcode;
  index: number;
  onChange: (id: string, value: string) => void;
  onClearValue: (id: string) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
};

function BarcodeCard({ barcode, index, onChange, onClearValue, onDelete, canDelete }: CardProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (!barcode.value) {
      setError(null);
      svg.innerHTML = "";
      return;
    }
    try {
      JsBarcode(svg, barcode.value, {
        format: "CODE128",
        displayValue: true,
        margin: 10,
        height: 100,
        fontSize: 16,
      });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "바코드를 생성할 수 없습니다.");
      svg.innerHTML = "";
    }
  }, [barcode.value]);

  const inputId = `value-${barcode.id}`;

  return (
    <section className={`${styles.card} p-4 rounded-lg lg:py-6 gap-4 flex flex-col bg-white`}>
      <div className="flex flex-row items-center justify-between w-full">
        <span className="text-5xl opacity-[0.15] font-extrabold text-zinc-500 dark:text-zinc-500">
          #{index + 1}
        </span>
        <div className="flex flex-row gap-3 items-center justify-center">
          <button
            type="button"
            className={`${styles.card_button} text-xs flex gap-1.5 items-center h-8 lg:h-10 justify-center lg:text-sm pr-4 pl-3.5 cursor-pointer rounded`}
            onClick={() => onClearValue(barcode.id)}
            disabled={!barcode.value}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              className="w-4 stroke-[1.5]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              ></path>
            </svg>
            값 삭제
          </button>
          <button
            type="button"
            className={`${styles.card_button} ${styles.danger} flex gap-1.5 items-center h-8 lg:h-10 justify-center text-xs lg:text-sm pr-4 pl-3.5 rounded cursor-pointer`}
            onClick={() => onDelete(barcode.id)}
            disabled={!canDelete}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              className="w-4 stroke-[1.5]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              ></path>
            </svg>
            삭제
          </button>
        </div>
      </div>

      <div className={`${styles.field} flex flex-col gap-1 lg:gap-1.5`}>
        <input
          id={inputId}
          type="text"
          value={barcode.value}
          onChange={(e) => onChange(barcode.id, e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="text-sm lg:text-base bg-white rounded-lg px-4 h-10"
          placeholder="이곳에 값을 입력하세요"
        />
      </div>

      <div
        className={`${styles.preview} ${error ? styles.error : ""} flex p-4 h-[180px] lg:h-[220px] rounded-lg bg-white lg:p-6 flex-col items-center justify-center gap-2`}
      >
        <svg ref={svgRef} style={{ display: error ? "none" : undefined }} />
        {error && <span className="text-xs lg:text-sm">{error}</span>}
      </div>
    </section>
  );
}

export default function Home() {
  const idCounterRef = useRef(1);
  const makeId = () => String(idCounterRef.current++);

  const [barcodes, setBarcodes] = useState<Barcode[]>([{ id: "0", value: "" }]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const lastLengthRef = useRef(barcodes.length);

  const handleAdd = () => {
    setBarcodes((prev) => [...prev, { id: makeId(), value: "" }]);
  };

  const handleBulkDelete = () => {
    setBarcodes([{ id: makeId(), value: "" }]);
  };

  const handleBulkClearValues = () => {
    setBarcodes((prev) => prev.map((b) => ({ ...b, value: "" })));
  };

  const updateValue = useCallback((id: string, value: string) => {
    setBarcodes((prev) => prev.map((b) => (b.id === id ? { ...b, value } : b)));
  }, []);

  const clearValue = useCallback((id: string) => {
    setBarcodes((prev) => prev.map((b) => (b.id === id ? { ...b, value: "" } : b)));
  }, []);

  const deleteBarcode = useCallback((id: string) => {
    setBarcodes((prev) => (prev.length <= 1 ? prev : prev.filter((b) => b.id !== id)));
  }, []);

  useEffect(() => {
    if (barcodes.length > lastLengthRef.current) {
      const list = listRef.current;
      const last = list?.lastElementChild as HTMLElement | null;
      last?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    lastLengthRef.current = barcodes.length;
  }, [barcodes.length]);

  return (
    <main className="flex flex-col items-center justify-start w-full pt-[calc((100dvh-552px)/2)] lg:pt-[calc((100dvh-681px)/2)] pb-10 lg:pb-20">
      <div className="w-full mx-auto max-w-xl lg:max-w-3xl flex flex-col gap-4 lg:gap-6">
        <header className="flex flex-col items-center justify-center gap-2 lg:gap-4">
          <h1 className="text-2xl text-center lg:text-4xl font-bold tracking-tight leading-snug text-zinc-900 dark:text-zinc-50">
            김종민이 만들라고 해서 만든
            <br />
            <span className="text-blue-500">바코드 생성기</span>
          </h1>
          <p className="text-xs text-center lg:text-sm text-zinc-600 dark:text-zinc-400">
            값을 입력하면 실시간으로 바코드가 생성됩니다.
          </p>
        </header>

        <nav
          className={`${styles.nav} sticky top-0 z-10 lg:rounded-lg lg:border lg:border-[#e4e4e7] px-4 py-3 flex gap-1.5 lg:gap-4`}
        >
          <button
            type="button"
            className={`${styles.nav_button} ${styles.add} flex-1 h-10 gap-1.5 flex items-center justify-center px-2 text-center whitespace-nowrap cursor-pointer rounded text-xs lg:text-sm font-semibold`}
            onClick={handleAdd}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              width="20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              ></path>
            </svg>
            추가
          </button>
          <button
            type="button"
            className={`${styles.nav_button} flex-1 gap-1.5 flex h-10 items-center justify-center px-2 text-center whitespace-nowrap cursor-pointer rounded text-xs lg:text-sm font-semibold`}
            onClick={handleBulkClearValues}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              className="w-5 stroke-[1.5]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              ></path>
            </svg>
            값 일괄 초기화
          </button>
          <button
            type="button"
            className={`${styles.nav_button} ${styles.danger} flex-1 h-10 gap-1.5 flex items-center justify-center px-2 text-center whitespace-nowrap cursor-pointer rounded text-xs lg:text-sm font-semibold`}
            onClick={handleBulkDelete}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              className="w-5 stroke-[1.5]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              ></path>
            </svg>
            일괄 삭제
          </button>
        </nav>

        <div ref={listRef} className="flex flex-col gap-4 px-4 lg:px-6 lg:gap-6">
          {barcodes.map((barcode, index) => (
            <BarcodeCard
              key={barcode.id}
              barcode={barcode}
              index={index}
              onChange={updateValue}
              onClearValue={clearValue}
              onDelete={deleteBarcode}
              canDelete={barcodes.length > 1}
            />
          ))}
        </div>

        <footer className="text-center text-xs lg:text-sm text-zinc-500 dark:text-zinc-500">
          광고 없다 나한테 고마워 하셈 😎 커스텀 권한은 김종민을 괴롭히세요
        </footer>
      </div>
    </main>
  );
}
