"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { BOT_DEMO, GUION_CHAT_DEMO } from "./data";
import styles from "./chatDemo.module.css";

interface Mensaje {
  id: number;
  emisor: "bot" | "visitante";
  texto: string;
  hora?: string;
  leido?: boolean;
}

const RETRASO_ESCRITURA_MS = 900;
const RETRASO_LEIDO_MS = 600;

// Etapa D de ContactoChat: velocidad del tipeo del saludo inicial, acotada
// para que un saludo largo no tarde una eternidad en aparecer.
const TIPEO_DURACION_MAX_MS = 900;
const TIPEO_VELOCIDAD_MIN_MS = 12;
const TIPEO_VELOCIDAD_MAX_MS = 28;

function horaActual() {
  return new Date().toLocaleTimeString("es", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function prefiereMovimientoReducido() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function mensajeInicial(): Mensaje[] {
  // Sin `hora`: se renderiza igual en servidor y cliente, sin riesgo de
  // mismatch de hidratación. Los mensajes siguientes nacen 100% post-mount.
  return [{ id: 0, emisor: "bot", texto: GUION_CHAT_DEMO[0].texto }];
}

function IconoEnviar() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4Z" />
    </svg>
  );
}

function IconoVolver() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function IconoLeido({ activo }: { activo: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={activo ? styles.checkLeido : styles.checkEnviado}
    >
      <path d="m2 12 5 5L18 6" />
      <path d="m8 12 5 5L24 6" />
    </svg>
  );
}

interface ChatDemoProps {
  /** Si se provee, muestra un botón de "volver" en el header (uso: ContactoChat) */
  onCerrar?: () => void;
  /** Etapa B de ContactoChat: fondo de header/footer visible */
  fondoVisible?: boolean;
  /** Etapa C de ContactoChat: contenido de header/footer visible */
  contenidoVisible?: boolean;
  /** Etapa D de ContactoChat: área de mensajes visible (dispara el tipeo
   *  del saludo en cada apertura, mientras no haya más mensajes) */
  mensajesVisible?: boolean;
  /** Avisa a ContactoChat que la etapa D terminó (tipeo completo, o paso
   *  instantáneo si ya hay más mensajes que el saludo) */
  onMensajeListo?: () => void;
  /** Deshabilita el botón "volver" mientras la máquina de fases de
   *  ContactoChat está a mitad de una transición */
  transicionando?: boolean;
}

export default function ChatDemo({
  onCerrar,
  fondoVisible = true,
  contenidoVisible = true,
  mensajesVisible = true,
  onMensajeListo,
  transicionando = false,
}: ChatDemoProps) {
  const [mensajes, setMensajes] = useState<Mensaje[]>(mensajeInicial);
  const [borrador, setBorrador] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const [indiceGuion, setIndiceGuion] = useState(1);
  const [caracteresSaludo, setCaracteresSaludo] = useState(0);
  const [saludoCompleto, setSaludoCompleto] = useState(false);
  const [reinicios, setReinicios] = useState(0);
  const idRef = useRef(1);
  const listaRef = useRef<HTMLDivElement>(null);

  const terminado = indiceGuion >= GUION_CHAT_DEMO.length;

  useEffect(() => {
    const lista = listaRef.current;
    if (lista) lista.scrollTop = lista.scrollHeight;
  }, [mensajes, escribiendo]);

  // Etapa D: cada vez que el área de mensajes se hace visible (se abre el
  // chat) tipea el saludo carácter a carácter — también en reaperturas, no
  // solo la primera vez. Si el visitante ya escribió antes de cerrar (hay
  // más mensajes que el saludo), no hay nada que tipear — se avisa de
  // inmediato para que ContactoChat siga a "abierto".
  useEffect(() => {
    if (!mensajesVisible) return;

    // Todo cambio de estado ocurre dentro de un callback de timer (nunca
    // de forma síncrona en el cuerpo del efecto), para no encadenar renders.
    let intervalo: number | undefined;
    const arranque = window.setTimeout(() => {
      if (mensajes.length > 1 || prefiereMovimientoReducido()) {
        setSaludoCompleto(true);
        onMensajeListo?.();
        return;
      }

      const texto = mensajes[0]?.texto ?? "";
      const velocidad = Math.max(
        TIPEO_VELOCIDAD_MIN_MS,
        Math.min(TIPEO_VELOCIDAD_MAX_MS, TIPEO_DURACION_MAX_MS / Math.max(texto.length, 1)),
      );

      setSaludoCompleto(false);
      setCaracteresSaludo(0);
      let caracteres = 0;
      intervalo = window.setInterval(() => {
        caracteres += 1;
        setCaracteresSaludo(caracteres);
        if (caracteres >= texto.length) {
          window.clearInterval(intervalo);
          setSaludoCompleto(true);
          onMensajeListo?.();
        }
      }, velocidad);
    }, 0);

    return () => {
      window.clearTimeout(arranque);
      window.clearInterval(intervalo);
    };
    // Solo debe reiniciar el tipeo cuando la etapa D se activa de nuevo o
    // tras "Reiniciar" — no en cada cambio de `mensajes`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mensajesVisible, reinicios]);

  function enviarMensaje(evento: FormEvent) {
    evento.preventDefault();
    const texto = borrador.trim();
    if (!texto || terminado || escribiendo) return;

    const idVisitante = idRef.current++;
    setMensajes((previos) => [
      ...previos,
      { id: idVisitante, emisor: "visitante", texto, hora: horaActual() },
    ]);
    setBorrador("");

    window.setTimeout(() => {
      setMensajes((previos) =>
        previos.map((mensaje) =>
          mensaje.id === idVisitante ? { ...mensaje, leido: true } : mensaje,
        ),
      );
    }, RETRASO_LEIDO_MS);

    setEscribiendo(true);
    window.setTimeout(() => {
      setEscribiendo(false);
      setIndiceGuion((indiceActual) => {
        const respuesta = GUION_CHAT_DEMO[indiceActual];
        if (!respuesta) return indiceActual;
        setMensajes((previos) => [
          ...previos,
          {
            id: idRef.current++,
            emisor: "bot",
            texto: respuesta.texto,
            hora: horaActual(),
          },
        ]);
        return indiceActual + 1;
      });
    }, RETRASO_ESCRITURA_MS);
  }

  function reiniciar() {
    setMensajes(mensajeInicial());
    setBorrador("");
    setEscribiendo(false);
    setIndiceGuion(1);
    idRef.current = 1;
    setSaludoCompleto(false);
    setCaracteresSaludo(0);
    setReinicios((n) => n + 1);
  }

  return (
    <div className={styles.chat} aria-label="Demo del asistente de tickets">
      <header
        className={`${styles.chatHeader} ${
          fondoVisible ? styles.chatHeaderVisible : ""
        }`}
      >
        <div
          className={`${styles.chatHeaderContenido} ${
            contenidoVisible ? styles.chatHeaderContenidoVisible : ""
          }`}
        >
          {onCerrar && (
            <button
              type="button"
              className={styles.chatVolver}
              onClick={onCerrar}
              disabled={transicionando}
              aria-label="Cerrar chat"
            >
              <IconoVolver />
            </button>
          )}
          <span className={styles.chatAvatar} aria-hidden="true">
            {BOT_DEMO.iniciales}
          </span>
          <div className={styles.chatIdentidad}>
            <p className={styles.chatNombre}>{BOT_DEMO.nombre}</p>
            <p className={styles.chatEstado}>{BOT_DEMO.estado}</p>
          </div>
          <button
            type="button"
            className={styles.chatReiniciar}
            onClick={reiniciar}
          >
            Reiniciar
          </button>
        </div>
      </header>

      <div
        className={`${styles.chatMensajes} ${
          mensajesVisible ? styles.chatMensajesVisible : ""
        }`}
        ref={listaRef}
        role="log"
        aria-live="polite"
      >
        {mensajes.map((mensaje) => {
          const esSaludo = mensaje.id === 0;
          const texto =
            esSaludo && !saludoCompleto
              ? mensaje.texto.slice(0, caracteresSaludo)
              : mensaje.texto;

          return (
            <div
              key={mensaje.id}
              className={`${styles.burbujaFila} ${
                mensaje.emisor === "visitante" ? styles.filaVisitante : ""
              }`}
            >
              <p
                className={`${styles.burbuja} ${
                  mensaje.emisor === "visitante"
                    ? styles.burbujaVisitante
                    : styles.burbujaBot
                }`}
              >
                {texto}
                {mensaje.hora && (
                  <span className={styles.burbujaMeta}>
                    {mensaje.hora}
                    {mensaje.emisor === "visitante" && (
                      <IconoLeido activo={Boolean(mensaje.leido)} />
                    )}
                  </span>
                )}
              </p>
            </div>
          );
        })}

        {escribiendo && (
          <div className={styles.burbujaFila}>
            <p
              className={`${styles.burbuja} ${styles.burbujaBot} ${styles.burbujaEscribiendo}`}
              aria-label="El bot está escribiendo"
            >
              <span className={styles.puntoEscritura} />
              <span className={styles.puntoEscritura} />
              <span className={styles.puntoEscritura} />
            </p>
          </div>
        )}
      </div>

      <form
        className={`${styles.chatForm} ${
          fondoVisible ? styles.chatFormVisible : ""
        }`}
        onSubmit={enviarMensaje}
      >
        <div
          className={`${styles.chatFormContenido} ${
            contenidoVisible ? styles.chatFormContenidoVisible : ""
          }`}
        >
          <label htmlFor="chat-demo-input" className={styles.chatInputLabel}>
            Escribí un mensaje para el bot de la demo
          </label>
          <input
            id="chat-demo-input"
            type="text"
            className={styles.chatInput}
            placeholder={
              terminado
                ? "Demo finalizada — reiniciá para probarla de nuevo"
                : "Escribí tu mensaje…"
            }
            value={borrador}
            onChange={(evento) => setBorrador(evento.target.value)}
            disabled={terminado}
            autoComplete="off"
          />
          <button
            type="submit"
            className={styles.chatEnviar}
            disabled={terminado || !borrador.trim()}
            aria-label="Enviar mensaje"
          >
            <IconoEnviar />
          </button>
        </div>
      </form>
    </div>
  );
}
