<div align="center">

<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# CPU Scheduler Simulator

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://github.com/carellonicolo/Scheduler/graphs/commit-activity)

An advanced, interactive, and visually stunning CPU Scheduler Simulator designed to help students and developers understand operating system scheduling algorithms.

[View Demo](https://ai.studio/apps/drive/1MH8EjZIbJ_kbpJ-SrdaDNvuzIFQxAbwV) · [Report Bug](.github/ISSUE_TEMPLATE/bug_report.md) · [Request Feature](.github/ISSUE_TEMPLATE/feature_request.md)

</div>

## 📖 About The Project

CPU scheduling is a core concept in operating systems that typically involves complex algorithms and abstract logic. This project changes that by providing a **real-time visualizer** where users can see exactly how processes are managed by the CPU.

Whether you're a student learning about FCFS or a developer exploring Round Robin time slices, this simulator brings the theory to life.

### Key Features

*   **Interactive Simulation**: Add processes dynamically, control time steps, and watch the queues update in real-time.
*   **Multiple Algorithms**: Supports First Come First Serve (FCFS), Shortest Job First (SJF), Round Robin (RR), Priority Scheduling, and more.
*   **Detailed Analytics**: Visual charts and tables comparing Turnaround Time, Waiting Time, and CPU Utilization.
*   **Modern UI/UX**: Built with a sleek, dark-themed interface using Tailwind CSS and Framer Motion for smooth animations.
*   **Step-by-Step Execution**: Pause, play, and step through the simulation to catch every detail.

## 🛠️ Built With

*   **[React](https://reactjs.org/)** - For building the user interface.
*   **[TypeScript](https://www.typescriptlang.org/)** - For type-safe code and better developer experience.
*   **[Vite](https://vitejs.dev/)** - For lightning-fast build and development server.
*   **[Tailwind CSS](https://tailwindcss.com/)** - For utility-first styling.
*   **[Framer Motion](https://www.framer.com/motion/)** - For complex animations and gestures.
*   **[Lucide React](https://lucide.dev/)** - For beautiful icons.

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

*   Node.js (v16+)
*   npm

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/carellonicolo/Scheduler.git
    ```

2.  **Navigate to the project directory**
    ```sh
    cd Scheduler
    ```

3.  **Install dependencies**
    ```sh
    npm install
    ```

4.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory and add your Gemini API key if you plan to use AI features (optional but recommended for full experience).
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

5.  **Run the development server**
    ```sh
    npm run dev
    ```

## 🎮 Usage

1.  **Select Algorithm**: Choose a scheduling algorithm from the dropdown menu (e.g., FCFS, Round Robin).
2.  **Add Processes**: Use the input panel to add processes with specific Arrival Times, Burst Times, and Priorities.
3.  **Start Simulation**: Click the "Start" button to begin the visual execution.
4.  **Analyze**: Watch the Gantt chart populate and review the calculated metrics in the analytics tab.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file for more details.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Authors

*   **Nicolò Carello** - *Initial work* - [carellonicolo](https://github.com/carellonicolo)

## 🙏 Acknowledgments

*   Thanks to all the contributors who have improved this project.
*   Inspired by standard OS concepts taught in computer science curricula.

---

<div align="center">
    <p>Made with ❤️ by Nicolò Carello</p>
</div>
