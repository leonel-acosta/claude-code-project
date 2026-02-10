# SkyPulse - Weather App 🌦️

A modern weather application built entirely through **vibe coding** with [Claude Code](https://claude.ai/code), Anthropic's AI-powered CLI tool for software development.

> **Note:** This entire project, including this documentation, was created through AI-assisted development using Claude Code.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest)

## What is Vibe Coding?

**Vibe coding** is a development approach where you collaborate with AI to build software through natural language conversations. Instead of writing every line of code manually, you describe what you want to achieve, and the AI helps implement it while you guide the direction and make decisions.

This project demonstrates how vibe coding with Claude Code can be used to:
- Scaffold a complete React application
- Implement features through iterative conversation
- Debug and fix issues in real-time
- Write comprehensive unit tests
- Maintain code quality and best practices

## Project Overview

SkyPulse is a weather application that displays real-time weather data based on the user's location or a searched city.

### Features

- **Geolocation Support** - Automatically detects user's location
- **City Search** - Search for any city worldwide
- **Reverse Geocoding** - Displays city name for geolocated coordinates
- **7-Day Forecast** - Shows weekly weather predictions
- **Dark/Light Mode** - Theme toggle with system preference detection
- **Responsive Design** - Works on desktop and mobile devices
- **Unit Tests** - Comprehensive test coverage with Vitest

### Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Build Tool | Vite |
| Testing | Vitest + React Testing Library |
| Weather API | Open-Meteo (free, no API key required) |
| Geocoding | Nominatim (OpenStreetMap) |

## The Vibe Coding Process

This project was built through a series of conversational interactions with Claude Code. Here's how the development process unfolded:

### Phase 1: Project Scaffolding
- Initial project setup with Vite, React, and TypeScript
- Configured Tailwind CSS 4 for styling
- Established project structure and conventions

### Phase 2: Core Features
- Implemented weather data fetching from Open-Meteo API
- Created geolocation hook for user location detection
- Built UI components (Cards, Buttons, Inputs, Spinners)
- Developed weather display components

### Phase 3: Enhanced UX
- Added city search functionality with geocoding
- Implemented dark/light theme toggle
- Added location display with city name and coordinates
- Integrated reverse geocoding for geolocation results

### Phase 4: Testing & Quality
- Set up Vitest testing framework
- Created unit tests for all utility functions
- Added tests for custom hooks (useGeolocation, useWeather)
- Implemented service layer tests with mocked APIs

### Phase 5: Polish & Documentation
- Fixed Tailwind CSS v4 compatibility issues
- Updated class names to canonical v4 syntax
- Added proper dark mode configuration
- Created this README documentation

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/claude-code-project.git

# Navigate to project directory
cd claude-code-project

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Spinner.tsx
│   └── weather/         # Weather-specific components
│       ├── CurrentWeather.tsx
│       ├── Forecast.tsx
│       └── LocationSearch.tsx
├── hooks/               # Custom React hooks
│   ├── useGeolocation.ts
│   └── useWeather.ts
├── services/            # API integrations
│   └── weather.ts
├── context/             # React context providers
│   └── ThemeContext.tsx
├── pages/               # Page components
│   └── Home.tsx
├── types/               # TypeScript definitions
├── utils/               # Utility functions
└── test/                # Test setup and utilities
```

## Test Coverage

The project includes comprehensive unit tests covering:

- **Utility Functions** (18 tests)
  - Temperature formatting (Celsius/Fahrenheit)
  - Date and time formatting

- **Services** (16 tests)
  - Weather API fetching
  - City search geocoding
  - Reverse geocoding

- **Hooks** (17 tests)
  - Geolocation state management
  - Weather data fetching
  - Error handling

## Claude Code Skills Demonstrated

This project showcases various Claude Code capabilities:

1. **Code Generation** - Creating components, hooks, and utilities from natural language descriptions
2. **Debugging** - Identifying and fixing issues like Tailwind v4 dark mode configuration
3. **Refactoring** - Improving code structure and following best practices
4. **Testing** - Writing comprehensive unit tests with proper mocking
5. **Documentation** - Generating clear, informative documentation
6. **Problem Solving** - Addressing compatibility issues and edge cases

## Lessons Learned

Through this vibe coding experience:

- **Iterative Development** - Building features incrementally through conversation works well
- **Clear Communication** - Specific requests yield better results
- **Verification** - Running builds and tests after changes catches issues early
- **Context Matters** - Providing context about the tech stack helps AI make appropriate choices

## Contributing

This project serves as a portfolio demonstration. Feel free to fork and experiment with your own vibe coding sessions!

## License

MIT License - feel free to use this project as inspiration for your own AI-assisted development experiments.

---

<p align="center">
  <em>Built with Claude Code - Showcasing the future of AI-assisted development</em>
</p>
