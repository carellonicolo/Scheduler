<div align="center">

<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# CPU Scheduler Simulator

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://github.com/carellonicolo/Scheduler/graphs/commit-activity)

**The Ultimate Educational Tool for Operating System Scheduling Algorithms.**

[View Live Demo](https://ai.studio/apps/drive/1MH8EjZIbJ_kbpJ-SrdaDNvuzIFQxAbwV) · [Report Bug](.github/ISSUE_TEMPLATE/bug_report.md) · [Request Feature](.github/ISSUE_TEMPLATE/feature_request.md)

</div>

---

## 📖 Table of Contents

1.  [About The Project](#-about-the-project)
2.  [Key Features](#-key-features)
3.  [Supported Algorithms](#-supported-algorithms)
    *   [Non-Preemptive](#non-preemptive-algorithms)
    *   [Preemptive](#preemptive-algorithms)
4.  [Technical Architecture](#-technical-architecture)
5.  [Getting Started](#-getting-started)
6.  [Usage Guide](#-usage-guide)
7.  [Contributing](#-contributing)
8.  [License](#-license)
9.  [Contact & Acknowledgments](#-contact--acknowledgments)

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

### 🎨 Modern & Accessible UI
Built with **Tailwind CSS** and **Framer Motion**, the interface enables:
- **Dark/Light Mode** support.
- **Fluid Animations** for all state transitions.
- **Responsive Design** that works on tablets and desktops.

---

## 🧠 Supported Algorithms

We support a comprehensive suite of 9 algorithms, covering both classic and advanced scheduling strategies.

### Non-Preemptive Algorithms
*In these algorithms, once a process gets the CPU, it keeps it until it terminates or performs I/O.*

1.  **First Come First Serve (FCFS)**
    *   **Logic**: Serves processes in the exact order they arrive.
    *   **Pros**: Simple to implement, fair (no starvation).
    *   **Cons**: Susceptible to the **Convoy Effect**, where short processes wait behind a long one, drastically increasing Average Waiting Time.

2.  **Shortest Job First (SJF)**
    *   **Logic**: Selects the process with the smallest Burst Time.
    *   **Pros**: PROVABLY optimal for minimizing Average Waiting Time.
    *   **Cons**: Requires knowing Burst Time in advance; causes **Starvation** for long processes if short ones keep arriving.

3.  **Priority Scheduling (Non-Preemptive)**
    *   **Logic**: Selects the process with the highest priority (Lower Number = Higher Priority).
    *   **Pros**: Useful for systems where certain tasks are critical (e.g., Kernel tasks).
    *   **Cons**: Indefinite blocking (Starvation) for low-priority processes.

4.  **Highest Response Ratio Next (HRRN)**
    *   **Logic**: Calculates `Response Ratio = (Waiting Time + Burst Time) / Burst Time`. Selects process with highest ratio.
    *   **Pros**: Solves the starvation problem of SJF! As a process waits, its ratio increases, eventually ensuring it gets picked.
    *   **Cons**: Overhead of calculating ratio at every context switch.

5.  **Longest Job First (LJF)**
    *   **Logic**: Selects the process with the largest Burst Time.
    *   **Pros**: None in general purpose systems (educational use only).
    *   **Cons**: Maximizes Average Waiting Time (Opposite of SJF).

### Preemptive Algorithms
*The CPU can be taken away from a running process if a "more important" process arrives.*

6.  **Round Robin (RR)**
    *   **Logic**: Each process gets a fixed time slice (**Quantum**). If it doesn't finish, it goes to the back of the queue.
    *   **Pros**: Best for Time-Sharing systems; good Response Time.
    *   **Cons**: Performance depends heavily on Quantum size. (Too small = High Context Switch overhead; Too large = Degrades to FCFS).

7.  **Shortest Remaining Time First (SRTF)**
    *   **Logic**: The Preemptive version of SJF. If a new process arrives with a remaining time less than the current process's remaining time, it preempts.
    *   **Pros**: Minimal Average Waiting Time.
    *   **Cons**: High overhead; Starvation of long processes.

8.  **Priority Scheduling (Preemptive)**
    *   **Logic**: If a process arrives with a higher priority than the currently running one, it preempts.
    *   **Pros**: Ensures critical tasks are handled immediately.
    *   **Cons**: Starvation.

9.  **Longest Remaining Time First (LRTF)**
    *   **Logic**: Preemptive version of LJF.
    *   **Pros**: Educational value.
    *   **Cons**: Poor performance metrics.

---

## 🏗️ Technical Architecture

This project demonstrates a modern, scalable frontend architecture.

### Core Stack
*   **Vite**: For next-generation tooling and instant server start.
*   **React 18**: Utilizing functional components, Hooks (`useEffect`, `useContext`, `useMemo`), and strict typing.
*   **TypeScript**: Ensures type safety across the complex Scheduler State objects (`Process`, `GanttBlock`, `SchedulerState`).
*   **Tailwind CSS**: For utility-first, maintainable styling.

### Simulation Engine (`services/schedulerLogic.ts`)
The heart of the application is a **pure function** state machine:
`stepSimulation(currentState, algorithm) -> nextState`

This design ensures:
1.  **Determinism**: The same inputs always yield the same simulation.
2.  **Time Travel**: We can easily implement "Undo" or "Step Back" (planned feature) because state is immutable.
3.  **Separation of Concerns**: The logic is completely decoupled from the UI.

### Custom Hooks
*   `useScheduler`: Manages the timer loop and dispatching of simulation steps.
*   `useLanguage`: Handles internationalization (i18n) for Italian and English support.

---

## 🚀 Getting Started

To run this project locally, you'll need **Node.js** (v16 or higher) installed.

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/carellonicolo/Scheduler.git
    cd Scheduler
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup (Optional)**
    To enable the AI Insights feature, you need a Google Gemini API Key.
    Create a `.env.local` file:
    ```env
    VITE_GEMINI_API_KEY=your_actual_api_key_here
    ```

4.  **Start Dev Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

---

## 🎮 Usage Guide

### Defines Processes
1.  Use the **Sidebar Input**.
2.  Set **Arrival Time** (0 = starts immediately).
3.  Set **Burst Time** (Duration).
4.  Set **Priority** (Only for Priority algorithms).
5.  Click `Add Process` or use `Load Example` to auto-fill a scenario.

### Run Simulation
1.  Select an **Algorithm** from the bottom toolbar.
2.  If selecting **Round Robin**, adjust the **Time Quantum**.
3.  Click `▶ Play` to run or `⏯ Step` to move slowly.
4.  Adjust **Speed** slider to visualize context switches clearly.

### Analyze
1.  Watch the **Gantt Chart** populate.
2.  Check the **Stats Table** for coloring-coded metrics.
3.  Click **"Generate Insight"** to ask the AI for a performance report.

---

## 🤝 Contributing

Capabilities are limitless when we work together.
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact & Acknowledgments

**Nicolò Carello** - [GitHub Profile](https://github.com/carellonicolo)

*   Special thanks to the open-source community for the icons (Lucide) and UI libraries.
*   Inspired by the classic "Dinosaur Book" (Operating System Concepts by Silberschatz).

---
<div align="center">
  <sub>Built with ❤️ and ☕ by Nicolò Carello.</sub>
</div>
