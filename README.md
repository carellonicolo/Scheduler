<div align="center">

# CPU Scheduler Simulator

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://github.com/carellonicolo/Scheduler/graphs/commit-activity)

<br />

<h3>
  <a href="#-english">🇬🇧 English</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-italiano">🇮🇹 Italiano</a>
</h3>

</div>

---

<div id="-english"></div>

# 🇬🇧 English

**The Ultimate Educational Tool for Operating System Scheduling Algorithms.**

[View Live Demo](https://ai.studio/apps/drive/1MH8EjZIbJ_kbpJ-SrdaDNvuzIFQxAbwV) · [Report Bug](.github/ISSUE_TEMPLATE/bug_report.md) · [Request Feature](.github/ISSUE_TEMPLATE/feature_request.md)

## 📖 Table of Contents

1.  [About The Project](#-about-the-project)
2.  [Key Features](#-key-features)
3.  [Supported Algorithms](#-supported-algorithms)
4.  [Technical Architecture](#-technical-architecture)
5.  [Getting Started](#-getting-started)
6.  [Usage Guide](#-usage-guide)
7.  [Contributing](#-contributing)
8.  [License](#-license)

---

## 📖 About The Project

**CPU Scheduler Simulator** is an advanced, interactive, and visually stunning web application designed to bridge the gap between theoretical operating system concepts and practical understanding.

In a modern OS, the CPU scheduler is the component that decides which process runs at any given point in time. It is responsible for maximizing CPU utilization and throughput while minimizing waiting time, turnaround time, and response time. This simulator allows you to:
*   **Visualize** how different algorithms make decisions in real-time.
*   **Experiment** with edge cases (starvation, convoy effect).
*   **Analyze** performance metrics to objectively compare algorithms.

Whether you are a Computer Science student, a professor, or a self-taught developer, this tool provides the most intuitive way to master process scheduling.

## 🌟 Key Features

### 🖥️ Real-Time Visualization
Unlike static diagrams, this simulator features a dynamic **Gantt Chart** that builds up second-by-second. Watch processes move from the *Incoming Queue* to the *Ready Queue*, then to the *CPU*, and finally to the *Completed State*.

### ⚡ Step-by-Step Execution
Debugging an algorithm in your head is hard.
- **Play Mode**: Watch the simulation unfold at adjustable speeds.
- **Step Mode**: Pause time and advance one clock cycle at a time to analyze the exact state of the system (Critical for understanding Preemption).

### 🤖 AI-Powered Insights
Integrated with **Google Gemini AI**, the simulator doesn't just show you *what* happened, but explains *why*.
- Click "Generate Insight" after a run.
- The AI analyzes your specific dataset and explains inefficiencies (e.g., "Process P1 caused a convoy effect because...") or commends the schedule's optimality.

### 📊 Comprehensive Analytics
Data-driven learning is effective learning. The app calculates:
- **Turnaround Time (TAT)**: Completion Time - Arrival Time.
- **Waiting Time (WT)**: Turnaround Time - Burst Time.
- **CPU Utilization**: Percentage of time the CPU was busy.
- **Throughput**: Number of processes completed per time unit.

---

## 🧠 Supported Algorithms

### Non-Preemptive
1.  **First Come First Serve (FCFS)**: Serves processes in order of arrival. Simple but prone to Convoy Effect.
2.  **Shortest Job First (SJF)**: Selects process with smallest Burst Time. Optimal for average waiting time but risks Starvation.
3.  **Priority Scheduling**: Selects highest priority. Pros: Critical tasks first. Cons: Starvation for low priority.
4.  **Highest Response Ratio Next (HRRN)**: Considers waiting time to prevent starvation. `(Wait + Burst) / Burst`.
5.  **Longest Job First (LJF)**: Educational algorithm, maximizes waiting time.

### Preemptive
6.  **Round Robin (RR)**: Fixed time slice (Quantum). Best for time-sharing systems.
7.  **Shortest Remaining Time First (SRTF)**: Preemptive SJF. Preempts if a shorter job arrives.
8.  **Priority Preemptive**: Preempts if a higher priority job arrives.
9.  **Longest Remaining Time First (LRTF)**: Preemptive LJF.

---

## 🏗️ Technical Architecture

This project demonstrates a modern, scalable frontend architecture.

*   **Vite & React 18**: For performance and component-based UI.
*   **TypeScript**: Ensures type safety across complex Scheduler states.
*   **Tailwind CSS & Framer Motion**: For a responsive, animated dark-mode UI.
*   **Pure Function Logic**: The scheduler engine `stepSimulation(state, algo)` is completely decoupled from the UI, ensuring determinism.

---

## 🚀 Getting Started

1.  **Clone**: `git clone https://github.com/carellonicolo/Scheduler.git`
2.  **Install**: `npm install`
3.  **Run**: `npm run dev`

Environment Variable for AI Features:
`VITE_GEMINI_API_KEY=your_key` in `.env.local`.

---

## 🎮 Usage Guide

1.  **Add Processes**: Use the sidebar to set Arrival, Burst, and Priority.
2.  **Run**: Choose an algorithm and click Play.
3.  **Analyze**: View the Gantt Chart and Stats Table.

---

<div align="center">
  <br/><br/>
  <h1>***</h1>
  <br/><br/>
</div>

<div id="-italiano"></div>

# 🇮🇹 Italiano

**Lo Strumento Educativo Definitivo per gli Algoritmi di Scheduling dei Sistemi Operativi.**

[Guarda la Demo](https://ai.studio/apps/drive/1MH8EjZIbJ_kbpJ-SrdaDNvuzIFQxAbwV) · [Segnala un Bug](.github/ISSUE_TEMPLATE/bug_report.md) · [Richiedi Funzionalità](.github/ISSUE_TEMPLATE/feature_request.md)

## 📖 Indice

1.  [Informazioni sul Progetto](#-informazioni-sul-progetto)
2.  [Funzionalità Chiave](#-funzionalità-chiave)
3.  [Algoritmi Supportati](#-algoritmi-supportati)
4.  [Architettura Tecnica](#-architettura-tecnica)
5.  [Per Iniziare](#-per-iniziare)
6.  [Guida all'Uso](#-guida-alluso)
7.  [Contribuire](#-contribuire)
8.  [Licenza](#-licenza)

---

## 📖 Informazioni sul Progetto

**CPU Scheduler Simulator** è un'applicazione web avanzata, interattiva e visivamente curata, progettata per colmare il divario tra i concetti teorici dei sistemi operativi e la comprensione pratica.

In un sistema operativo moderno, lo scheduler della CPU è il componente che decide quale processo eseguire. È responsabile di massimizzare l'utilizzo della CPU e il throughput, minimizzando al contempo i tempi di attesa e di risposta. Questo simulatore ti permette di:
*   **Visualizzare** come i diversi algoritmi prendono decisioni in tempo reale.
*   **Sperimentare** con casi limite (starvation, convoy effect).
*   **Analizzare** le metriche di prestazione per confrontare oggettivamente gli algoritmi.

Che tu sia uno studente di Informatica, un professore o uno sviluppatore autodidatta, questo strumento offre il modo più intuitivo per padroneggiare lo scheduling dei processi.

## 🌟 Funzionalità Chiave

### 🖥️ Visualizzazione in Tempo Reale
A differenza dei diagrammi statici, questo simulatore dispone di un **Diagramma di Gantt** dinamico che si costruisce secondo per secondo. Osserva i processi spostarsi dalla *Incoming Queue* alla *Ready Queue*, poi alla *CPU*, e infine allo *Stato Completato*.

### ⚡ Esecuzione Step-by-Step
Fare il debug di un algoritmo a mente è difficile.
- **Modalità Play**: Guarda la simulazione svolgersi a velocità regolabile.
- **Modalità Step**: Metti in pausa e avanza di un ciclo di clock alla volta per analizzare lo stato esatto del sistema (Fondamentale per capire la Preemption).

### 🤖 Analisi con Intelligenza Artificiale
Integrato con **Google Gemini AI**, il simulatore non ti mostra solo *cosa* è successo, ma spiega *perché*.
- Clicca su "Genera Insight" dopo una simulazione.
- L'AI analizza il tuo set di dati specifico e spiega le inefficienze (es. "Il processo P1 ha causato un effetto convoglio perché...") o elogia l'ottimalità della schedulazione.

### 📊 Analisi Completa
L'apprendimento basato sui dati è efficace. L'app calcola:
- **Turnaround Time (TAT)**: Tempo di Completamento - Tempo di Arrivo.
- **Waiting Time (WT)**: Turnaround Time - Burst Time.
- **Utilizzo CPU**: Percentuale di tempo in cui la CPU è stata occupata.
- **Throughput**: Numero di processi completati per unità di tempo.

---

## 🧠 Algoritmi Supportati

### Non-Preemptive
*Una volta che un processo ottiene la CPU, la mantiene fino al termine o all'I/O.*

1.  **First Come First Serve (FCFS)**: Serve i processi in ordine di arrivo. Semplice ma soggetto al "Convoy Effect".
2.  **Shortest Job First (SJF)**: Seleziona il processo con il Burst Time minore. Ottimale per l'attesa media ma rischia la Starvation.
3.  **Priority Scheduling**: Seleziona la priorità più alta. Pro: compiti critici subito. Contro: Starvation per bassa priorità.
4.  **Highest Response Ratio Next (HRRN)**: Considera il tempo di attesa per prevenire la starvation. Formula: `(Attesa + Burst) / Burst`.
5.  **Longest Job First (LJF)**: Algoritmo educativo, massimizza il tempo di attesa.

### Preemptive
*La CPU può essere tolta a un processo in esecuzione se arriva un processo "più importante".*

6.  **Round Robin (RR)**: Time slice fisso (Quantum). Ideale per sistemi time-sharing.
7.  **Shortest Remaining Time First (SRTF)**: Versione preemptive di SJF. Interrompe se arriva un lavoro più breve.
8.  **Priority Preemptive**: Interrompe se arriva un lavoro a priorità più alta.
9.  **Longest Remaining Time First (LRTF)**: Versione preemptive di LJF.

---

## 🏗️ Architettura Tecnica

Questo progetto dimostra un'architettura frontend moderna e scalabile.

*   **Vite & React 18**: Per tooling di nuova generazione e UI a componenti.
*   **TypeScript**: Garantisce la sicurezza dei tipi attraverso stati complessi dello Scheduler.
*   **Tailwind CSS & Framer Motion**: Per un'interfaccia responsive e animata (supporto Dark Mode).
*   **Logica a Funzioni Pure**: Il motore dello scheduler `stepSimulation(state, algo)` è completamente disaccoppiato dalla UI, garantendo determinismo e facilità di test.

---

## 🚀 Per Iniziare

1.  **Clona**: `git clone https://github.com/carellonicolo/Scheduler.git`
2.  **Installa**: `npm install`
3.  **Esegui**: `npm run dev`

Variabile d'ambiente per funzionalità AI:
`VITE_GEMINI_API_KEY=tua_chiave` nel file `.env.local`.

---

## 🎮 Guida all'Uso

1.  **Aggiungi Processi**: Usa la barra laterale per impostare Arrivo, Burst e Priorità.
2.  **Esegui**: Scegli un algoritmo e clicca Play.
3.  **Analizza**: Guarda il Diagramma di Gantt e la Tabella delle Statistiche.

---

## 🤝 Contribuire

Le capacità sono illimitate quando lavoriamo insieme.
Leggi [CONTRIBUTING.md](CONTRIBUTING.md) per dettagli sul codice di condotta e sul processo per inviare pull request.

1.  Forka il Progetto
2.  Crea il tuo Branch (`git checkout -b feature/FunzionalitaFantastica`)
3.  Committa le tue Modifiche (`git commit -m 'Aggiungi FunzionalitaFantastica'`)
4.  Pusha il Branch (`git push origin feature/FunzionalitaFantastica`)
5.  Apri una Pull Request

---

## 🛡️ Licenza

Distribuito sotto la Licenz MIT. Vedi `LICENSE` per maggiori informazioni.

## 📞 Contatti & Riconoscimenti

**Nicolò Carello** - [Profilo GitHub](https://github.com/carellonicolo)

*   Un ringraziamento speciale alla community open-source per le icone (Lucide) e le librerie UI.
*   Ispirato dal classico "Dinosaur Book" (Operating System Concepts di Silberschatz).

---
<div align="center">
  <sub>Creato con ❤️ e ☕ da Nicolò Carello.</sub>
</div>
