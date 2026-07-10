# ArenaMind Stadium OS - Operations Frontend 🏟️

Welcome to the enterprise-grade operations console and smart stadium digital twin command center for **ArenaMind Stadium OS**. This frontend is designed with WCAG 2.2 AA accessibility, responsive telemetry cards, real-time WebSockets communication, and smooth 3D projections on HTML5 Canvas.

---

## 🏛️ Architecture & Folder Structure

This application uses a modular, **feature-based architecture** combined with shared layout components to follow the **Single Responsibility Principle (SRP)** and keep logic clean:

```text
src/
├── app/                  # Next.js App Router root layout & routing
├── components/           # Reusable global UI elements (AccessibilityPanel, ErrorBoundary, HologramStadium)
├── features/             # Isolated domain features with local services, hooks, and sub-components
│   ├── assistant/        # AI Co-pilot Chat Panel and services
│   ├── auth/             # Authentication forms, Zustand authStore, and mockable authService
│   ├── crowd/            #Scanner telemetry, status, and predict flow rates
│   ├── dashboard/        # Operations CommandCenter, SimulationControl, TelemetryStats, and DetailedTabs
│   ├── navigation/       # Evacuation routing guidance maps
│   ├── security/         # Emergency SOS dispatch gateway & incident log panels
│   └── transport/        # Transit coordination and shuttle logistics
├── constants/            # Central CONFIG object for endpoints, timeouts, and themes
└── providers/            # Client-side React context wrappers
```

---

## 🛠️ Tech Stack & Key Choices

* **Framework:** Next.js 16 (App Router) + React 19
* **Styling:** CSS & Tailwind CSS for glassmorphic elements and GPU-accelerated layouts
* **State Management:** Zustand (for auth token lifecycle and global parameters)
* **Animation:** Framer Motion (for smooth 60 FPS transitions and micro-interactions)
* **3D Projections:** HTML5 Canvas (custom dual-deck seating, lighting masts, and drag-to-rotate viewport calculations)
* **Testing Runner:** Vitest + @testing-library/react + jsdom

---

## ⚡ Performance & Optimization Strategies

1. **React.memo & Display Names:** Wrapped high-frequency redrawing components like [HologramStadium.tsx](src/components/HologramStadium.tsx) in `React.memo` to prevent re-evaluation when unrelated sibling tab states update.
2. **Hook Memoization:** Utilized `useMemo` and `useCallback` on 3D coordinates projections and dragging math formulas to maximize CPU thread efficiency.
3. **Strict CSS Nesting:** Eliminated layout shift (CLS) by locking dimensional parameters on volumetric lighting masts and charts.

---

## 🚨 Error Handling & Graceful Degradation

* **Error Boundaries:** A dedicated [ErrorBoundary.tsx](src/components/ErrorBoundary.tsx) class component catches component-tree rendering exceptions, keeps the rest of the telemetry operating, and displays a clean fallback console with a "Retry Component" trigger.
* **Typing Safety:** Strictly typed API request DTOs and responses inside `src/features/auth/types.ts` and `src/features/security/types.ts` to ensure type-safe properties without utilizing any `any` typings.

---

## 🧪 Testing Suite Instructions

We use **Vitest** for native ESM support, providing lightning-fast test execution.

### Run Tests
```bash
npm run test
```

### Coverage Reports
The tests verify:
* **`authService.spec.ts`**: Mock fetch calls, success JSON returns, and error throwing responses.
* **`authStore.spec.ts`**: Zustand state updates on login, logout, and token декод actions.
* **`ErrorBoundary.spec.tsx`**: Rendering fallback states, catching crashed children, and testing the retry action.

---

## 🚀 Local Setup

1. Copy environments: `cp .env.example .env`
2. Install packages: `npm install --legacy-peer-deps`
3. Run development mode: `npm run dev`
