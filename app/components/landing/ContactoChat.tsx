"use client";

import { useEffect, useState } from "react";
import ChatDemo from "./ChatDemo";
import styles from "./contactoChat.module.css";

function IconoMensaje() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </svg>
  );
}

// Máquina de fases de la apertura/cierre del chat. Cada etapa anima una
// sola cosa a la vez para que el contenido con texto nunca se escale:
//   A cascarón   — fondo/borde del panel, línea central que se expande
//   B fondo      — fondo de header/footer (sin contenido)
//   C contenido  — contenido de header/footer (desplazamiento + opacidad)
//   D mensaje    — área de mensajes + tipeo del saludo inicial
// El cierre recorre el mismo camino al revés (D'→C'→B'→A').
type FaseChat =
  | "cerrado"
  | "abriendo-cascaron"
  | "abriendo-fondo"
  | "abriendo-contenido"
  | "abriendo-mensaje"
  | "abierto"
  | "cerrando-mensaje"
  | "cerrando-contenido"
  | "cerrando-fondo"
  | "cerrando-cascaron";

const DURACION_CASCARON_MS = 280; // --transition-base
const DURACION_FONDO_MS = 150; // --transition-fast
const DURACION_CONTENIDO_MS = 280; // --transition-base
const DURACION_MENSAJE_CIERRE_MS = 150; // cierre rápido del área de mensajes

function prefiereMovimientoReducido() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function ContactoChat() {
  const [fase, setFase] = useState<FaseChat>("cerrado");

  // Encadena cada etapa temporizada a la siguiente. La etapa D
  // ("abriendo-mensaje") es la excepción: su duración depende del largo
  // del saludo tipeado, así que la avanza ChatDemo vía onMensajeListo.
  useEffect(() => {
    let temporizador: number | undefined;

    switch (fase) {
      case "abriendo-cascaron":
        temporizador = window.setTimeout(
          () => setFase("abriendo-fondo"),
          DURACION_CASCARON_MS,
        );
        break;
      case "abriendo-fondo":
        temporizador = window.setTimeout(
          () => setFase("abriendo-contenido"),
          DURACION_FONDO_MS,
        );
        break;
      case "abriendo-contenido":
        temporizador = window.setTimeout(
          () => setFase("abriendo-mensaje"),
          DURACION_CONTENIDO_MS,
        );
        break;
      case "cerrando-mensaje":
        temporizador = window.setTimeout(
          () => setFase("cerrando-contenido"),
          DURACION_MENSAJE_CIERRE_MS,
        );
        break;
      case "cerrando-contenido":
        temporizador = window.setTimeout(
          () => setFase("cerrando-fondo"),
          DURACION_CONTENIDO_MS,
        );
        break;
      case "cerrando-fondo":
        temporizador = window.setTimeout(
          () => setFase("cerrando-cascaron"),
          DURACION_FONDO_MS,
        );
        break;
      case "cerrando-cascaron":
        temporizador = window.setTimeout(
          () => setFase("cerrado"),
          DURACION_CASCARON_MS,
        );
        break;
      default:
        break;
    }

    return () => window.clearTimeout(temporizador);
  }, [fase]);

  function abrir() {
    if (fase !== "cerrado") return;
    setFase(prefiereMovimientoReducido() ? "abierto" : "abriendo-cascaron");
  }

  function cerrar() {
    if (fase !== "abierto") return;
    setFase(prefiereMovimientoReducido() ? "cerrado" : "cerrando-mensaje");
  }

  const cascaronVisible = fase !== "cerrado";
  const fondoVisible = ![
    "cerrado",
    "abriendo-cascaron",
    "cerrando-fondo",
    "cerrando-cascaron",
  ].includes(fase);
  const contenidoVisible = [
    "abriendo-contenido",
    "abriendo-mensaje",
    "abierto",
    "cerrando-mensaje",
  ].includes(fase);
  const mensajesVisible = fase === "abriendo-mensaje" || fase === "abierto";
  const transicionando = fase !== "cerrado" && fase !== "abierto";

  return (
    <div className={styles.chatBox}>
      <div
        className={`${styles.placeholder} ${
          fase !== "cerrado" ? styles.placeholderOculto : ""
        }`}
        inert={fase !== "cerrado"}
      >
        <p className={styles.placeholderTexto}>
          Activá el chat para interactuar con mi agente inteligente y
          arrancar un proyecto de desarrollo.
        </p>
        <button
          type="button"
          className={styles.toggle}
          onClick={abrir}
          aria-label="Abrir chat con el agente"
        >
          <IconoMensaje />
        </button>
      </div>

      <div
        className={`${styles.cascaron} ${
          cascaronVisible ? styles.cascaronVisible : ""
        }`}
        aria-hidden="true"
      />

      <div className={styles.chatContenedor} inert={fase === "cerrado"}>
        <ChatDemo
          onCerrar={cerrar}
          fondoVisible={fondoVisible}
          contenidoVisible={contenidoVisible}
          mensajesVisible={mensajesVisible}
          transicionando={transicionando}
          onMensajeListo={() =>
            setFase((actual) =>
              actual === "abriendo-mensaje" ? "abierto" : actual,
            )
          }
        />
      </div>
    </div>
  );
}
