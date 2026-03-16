# 🖥️ Alcodist Hub v2.0.26
**Architecting Resilient Distributed Systems | Personal Engineering Interface**

![Status](https://img.shields.io/badge/Status-Operational-green?style=for-the-badge&logo=render)
![Stack](https://img.shields.io/badge/Stack-React_|_Vite_|_Tailwind-333333?style=for-the-badge&logo=react)

## 📌 Executive Summary
Alcodist Hub is a high-performance, minimalist portfolio designed to showcase technical depth in software architecture. Moving away from traditional "project galleries," the Hub serves as a **Knowledge Base** for Technical Design Documents (TDDs), Industrial Case Studies, and deep-dive technical blogs.

The interface mimics a **System Terminal (OS)** to reflect a "bare-metal" engineering philosophy—prioritizing speed, precision, and architectural transparency.

---

## 🏗️ Architectural Highlights

### 1. Dynamic Content Categorization
The system implements a custom filtering engine that consumes the `razorblog-backend` API. It dynamically maps content into three distinct architectural layers:
* **TDDs (Technical Design Documents):** High-level system blueprints (e.g., RBAC implementations).
* **Case Studies:** Production post-mortems and problem-solving logs.
* **General Knowledge Base:** Core programming fundamentals and research.

### 2. Design System: "Industrial Minimal"
* **Typography:** Monospaced fonts for terminal-grade readability.
* **Performance:** Optimized with Vite for near-instantaneous TTFB (Time to First Byte).
* **UX:** Features a "System Status" monitor with live EAT (East Africa Time) synchronization and encrypted connection pulses.

---

## 🛠️ Tech Stack
* **Library:** React 18 (Functional Components / Hooks)
* **Styling:** Tailwind CSS (Utility-first, dark-mode primary)
* **Icons:** Lucide (react-icons/lu)
* **State Management:** Native React State + Context for Auth/Theming.
* **Deployment:** Vercel (CI/CD Integrated)

---

## 🚀 Local Installation
```bash
# Clone the repository
git clone [https://github.com/muthomivictor/alcodist-hub.git](https://github.com/muthomivictor/alcodist-hub.git)

# Install dependencies
npm install

# Setup Environment Variables (.env)
VITE_AUTHOR_ID=your_mongodb_id
VITE_API_URL=[https://razorblog-backend.onrender.com](https://razorblog-backend.onrender.com)

# Start Dev Server
npm run dev
```
### 🔒 Security & Integrity

The **Alcodist Hub** utilizes a strict **read-only integration** with the **Alcodist Lab**. 

* **Decoupled Architecture:** All technical documentation, TDDs, and case studies are consumed via secured **REST endpoints**.
* **Persistence Isolation:** This ensures the frontend interface remains entirely decoupled from the underlying data persistence logic and database schemas.
* **Data Sanctity:** By treating the frontend as a consumer-only layer, we prevent unauthorized write-access at the UI level, maintaining the integrity of the professional Knowledge Base.
