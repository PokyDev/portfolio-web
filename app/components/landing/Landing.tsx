"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import styles from "./landing.module.css";

type Status = "idle" | "loading" | "success" | "error";

interface HealthResult {
  ok: boolean;
  statusCode: number | null;
  body: string;
  timestamp: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const HIDE_DELAY_MS = 5000;
const FADE_DURATION_MS = 250; // debe matchear --transition-base en tokens.css

function formatBody(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

export default function Landing() {
  const { toggleTheme } = useTheme();
  const [status, setStatus] = useState<Status>("idle");
  const [panelVisible, setPanelVisible] = useState(false);
  const [result, setResult] = useState<HealthResult | null>(null);
  const [attemptId, setAttemptId] = useState(0);

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isBusy = status !== "idle";

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleTestBackend = useCallback(async () => {
    if (isBusy) return;

    setStatus("loading");
    setAttemptId((id) => id + 1);

    const timestamp = new Date().toLocaleTimeString();

    let next: HealthResult;
    try {
      if (!BACKEND_URL) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL no está configurada");
      }
      const response = await fetch(`${BACKEND_URL}/health`);
      const text = await response.text();
      next = {
        ok: response.ok,
        statusCode: response.status,
        body: text,
        timestamp,
      };
    } catch (err) {
      next = {
        ok: false,
        statusCode: null,
        body: err instanceof Error ? err.message : "Error desconocido",
        timestamp,
      };
    }

    setResult(next);
    setStatus(next.ok ? "success" : "error");
    setPanelVisible(true);

    hideTimerRef.current = setTimeout(() => {
      setPanelVisible(false);
      resetTimerRef.current = setTimeout(() => {
        setStatus("idle");
        setResult(null);
      }, FADE_DURATION_MS);
    }, HIDE_DELAY_MS);
  }, [isBusy]);

  const dotStatusClass =
    status === "loading"
      ? styles.dotLoading
      : status === "success"
        ? styles.dotSuccess
        : status === "error"
          ? styles.dotError
          : "";

  return (
    <main className={styles.page}>
      <div className={styles.stage}>
        <div
          className={`${styles.cardShell} ${panelVisible ? styles.cardShellShifted : ""}`}
        >
          <section className={styles.card}>
            <span className={styles.eyebrow}>
              <span className={`${styles.dot} ${dotStatusClass}`} />
              Estado del sistema
            </span>
            <p className={styles.phase}>
              Fase actual: configuración de entorno local
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.button}
                onClick={handleTestBackend}
                disabled={isBusy}
              >
                {status === "loading" ? "Probando…" : "Probar backend"}
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={toggleTheme}
              >
                <span className="dark:hidden">🌙 Modo oscuro</span>
                <span className="hidden dark:inline">☀️ Modo claro</span>
              </button>
            </div>
          </section>

          <div
            className={`${styles.panel} ${panelVisible ? styles.panelVisible : ""}`}
            role="status"
            aria-live="polite"
          >
            {result && (
              <>
                <p className={styles.panelEyebrow}>Respuesta del servidor</p>
                <p
                  className={
                    result.ok ? styles.lineSuccess : styles.lineError
                  }
                >
                  <span className={styles.prompt}>$</span> curl {BACKEND_URL}
                  /health
                </p>
                <pre className={styles.output}>{formatBody(result.body)}</pre>
                <p className={styles.meta}>
                  {result.timestamp}
                  {" — "}
                  {result.statusCode !== null
                    ? `HTTP ${result.statusCode}`
                    : "sin respuesta"}
                </p>
                <div className={styles.progressTrack}>
                  <div
                    key={attemptId}
                    className={`${styles.progressBar} ${
                      panelVisible ? styles.progressBarRunning : ""
                    }`}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
