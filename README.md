# CPU Scheduler Simulator

> Simulatore didattico di algoritmi di scheduling dei processi per sistemi operativi

[![Licenza MIT](https://img.shields.io/badge/Licenza-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-e91e63)](https://www.framer.com/motion/)
[![GitHub stars](https://img.shields.io/github/stars/carellonicolo/Scheduler?style=social)](https://github.com/carellonicolo/Scheduler)
[![GitHub issues](https://img.shields.io/github/issues/carellonicolo/Scheduler)](https://github.com/carellonicolo/Scheduler/issues)

## Panoramica

CPU Scheduler Simulator e un simulatore web interattivo per lo studio degli algoritmi di scheduling dei processi nei sistemi operativi. L'applicazione consente di definire un insieme di processi con i relativi parametri (tempo di arrivo, burst time, priorita) e di osservare il comportamento di diversi algoritmi di pianificazione attraverso diagrammi di Gantt animati e metriche di performance in tempo reale.

Lo strumento e pensato per studenti e docenti di Sistemi Operativi e Architettura dei Calcolatori, offrendo un ambiente visuale immediato per comprendere le differenze tra le varie strategie di scheduling.

## Funzionalita Principali

- **9 algoritmi di scheduling** — FCFS, SJF (Preemptive e Non-Preemptive), Priority (Preemptive e Non-Preemptive), Round Robin, SRTF, HRRN, Multilevel Queue
- **Diagramma di Gantt animato** — Visualizzazione in tempo reale dell'esecuzione dei processi con animazioni fluide
- **Metriche di performance** — Calcolo automatico di tempi di attesa, turnaround, response time e throughput
- **Editor processi** — Interfaccia intuitiva per aggiungere, modificare e rimuovere processi
- **Confronto tra algoritmi** — Possibilita di eseguire e confrontare diversi algoritmi sugli stessi dati
- **Tema chiaro/scuro** — Supporto completo per dark mode
- **Responsive** — Utilizzabile su qualsiasi dispositivo

## Tech Stack

| Tecnologia | Utilizzo |
|:--|:--|
| ![React](https://img.shields.io/badge/React_18-61dafb?logo=react&logoColor=white) | Framework UI |
| ![TypeScript](https://img.shields.io/badge/TypeScript_5-3178c6?logo=typescript&logoColor=white) | Linguaggio tipizzato |
| ![Vite](https://img.shields.io/badge/Vite_5-646cff?logo=vite&logoColor=white) | Build tool |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06b6d4?logo=tailwindcss&logoColor=white) | Styling |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-e91e63) | Animazioni |

## Requisiti

- **Node.js** >= 18
- **npm** >= 9 (oppure bun)

## Installazione

```bash
git clone https://github.com/carellonicolo/Scheduler.git
cd Scheduler
npm install
npm run dev
```

L'applicazione sara disponibile su `http://localhost:8080`.

## Utilizzo

1. **Aggiungi processi** specificando tempo di arrivo, burst time e priorita
2. **Seleziona l'algoritmo** di scheduling dal menu a tendina
3. **Configura i parametri** (es. quantum per Round Robin)
4. **Avvia la simulazione** e osserva il diagramma di Gantt animato
5. **Analizza le metriche** calcolate automaticamente

## Struttura del Progetto

```
Scheduler/
├── src/
│   ├── components/     # Componenti React (Gantt, editor, metriche)
│   ├── lib/            # Implementazione algoritmi di scheduling
│   ├── pages/          # Pagine dell'applicazione
│   └── hooks/          # Custom hooks
├── public/             # Asset statici
├── index.html          # Entry point HTML
└── vite.config.ts      # Configurazione Vite
```

## Deploy

```bash
npm run build
```

La cartella `dist/` e deployabile su Cloudflare Pages, Netlify, Vercel o qualsiasi hosting statico.

## Contribuire

I contributi sono benvenuti! Consulta le [linee guida per contribuire](CONTRIBUTING.md) per maggiori dettagli.

## Licenza

Distribuito con licenza MIT. Vedi il file [LICENSE](LICENSE) per i dettagli completi.

## Autore

**Nicolo Carello**
- GitHub: [@carellonicolo](https://github.com/carellonicolo)
- Website: [nicolocarello.it](https://nicolocarello.it)

---

<sub>Sviluppato con l'ausilio dell'intelligenza artificiale.</sub>

## Progetti Correlati

Questo progetto fa parte di una collezione di strumenti didattici e applicazioni open-source:

| Progetto | Descrizione |
|:--|:--|
| [DFA Visual Editor](https://github.com/carellonicolo/AFS) | Editor visuale per automi DFA |
| [Turing Machine](https://github.com/carellonicolo/Turing-Machine) | Simulatore di Macchina di Turing |
| [Subnet Calculator](https://github.com/carellonicolo/Subnet) | Calcolatore subnet IPv4/IPv6 |
| [Base Converter](https://github.com/carellonicolo/base-converter) | Suite di conversione multi-funzionale |
| [Gioco del Lotto](https://github.com/carellonicolo/giocodellotto) | Simulatore Lotto e SuperEnalotto |
| [MicroASM](https://github.com/carellonicolo/microasm) | Simulatore assembly |
| [Flow Charts](https://github.com/carellonicolo/flow-charts) | Editor di diagrammi di flusso |
| [Cypher](https://github.com/carellonicolo/cypher) | Toolkit di crittografia |
| [Snake](https://github.com/carellonicolo/snake) | Snake game retro |
| [Pong](https://github.com/carellonicolo/pongcarello) | Pong game |
| [Calculator](https://github.com/carellonicolo/calculator-carello) | Calcolatrice scientifica |
| [IPSC Score](https://github.com/carellonicolo/IPSC) | Calcolatore punteggi IPSC |
| [Quiz](https://github.com/carellonicolo/quiz) | Piattaforma quiz scolastici |
| [Carello Hub](https://github.com/carellonicolo/carello-hub) | Dashboard educativa |
| [Prof Carello](https://github.com/carellonicolo/prof-carello) | Gestionale lezioni private |
| [DOCSITE](https://github.com/carellonicolo/DOCSITE) | Piattaforma documentale |
