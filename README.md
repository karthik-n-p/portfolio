# Gesture Controlled 3JS MediaPipe Portfolio

A personal portfolio built to showcase my experience as a Data Engineer and Web Developer. The site features an interactive 3D background that responds to navigation, representing data flows and systems.

🌐 **Live Website:** [karthiknpportfolio.vercel.app]

## Technologies Used

- **React & Vite:** Core UI framework and build tooling.
- **Three.js (WebGL):** Renders the interactive 3D particle system and background grid.
- **MediaPipe:** Experimental webcam-based hand gesture control.
- **Vanilla CSS:** Custom styling using CSS variables and glassmorphism, without relying on external UI component libraries.

## Folder Structure

Here is a brief overview of the core source code structure:

```text
src/
├── data/
│   └── karthik.js          # Raw content data (skills, projects, experience)
├── gesture/
│   └── GestureOverlay.jsx  # MediaPipe webcam integration for hand tracking
├── three/                  # Three.js 3D rendering logic
│   ├── SceneCanvas.jsx     # Main WebGL canvas renderer and camera setup
│   ├── DataFlowField.js    # Particle system that morphs based on the active section
│   └── NetworkGrid.js      # Background geometric grid lattice
├── ui/                     # React UI components
│   ├── HubPanel.jsx        # Landing page summary and contact links
│   ├── ProjectsPanel.jsx   # Projects overview
│   ├── SkillsPanel.jsx     # Technical skills breakdown
│   ├── CertsPanel.jsx      # Certifications list
│   ├── EducationPanel.jsx  # Education history
│   └── Preloader.jsx       # Initial loading screen
├── App.jsx                 # Application layout, routing, and state management
├── design-tokens.js        # Shared colors, typography, and theme configuration
├── index.css               # Global CSS styles
└── main.jsx                # React entry point
```

## Running Locally

To run the project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/karthik-n-p/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Connect With Me

- **LinkedIn:** [Insert LinkedIn Profile URL]
- **GitHub:** [karthik-n-p](https://github.com/karthik-n-p)
