# 🕸️ ORIEN-WEB | Forgez Votre Destin

**ORIEN-WEB** is a high-end, immersive digital experience designed to guide students through the complex network of academic and professional orientation. Using a "weaving/network" metaphor, the platform transforms the stressful process of career planning into a premium, guided journey.

![ ORIEN-WEB Preview ](https://github.com/yahyatougui10-prog/web-oreinta/blob/main/static/images/bg1.jpg?raw=true)

## ✨ Key Features

### 🚀 Ultra-Premium UI/UX
- **Immersive 3D Environment**: A dynamic, interactive 3D particle network powered by **Three.js** that reacts to user scrolling.
- **Editorial Aesthetics**: A sophisticated dark theme utilizing **Glassmorphism**, deep violets, and high-contrast typography (**Playfair Display**).
- **Cinematic Motion**: Smooth, scroll-triggered reveals and micro-interactions powered by **GSAP**.
- **Adaptive Design**: Fully responsive layout that maintains its premium feel across all device sizes.

### 🛠️ Technical Stack
- **Backend**: FastAPI (Python) - High-performance asynchronous API.
- **Frontend**: Tailwind CSS, Three.js, GSAP.
- **Templating**: Jinja2.
- **Infrastructure**: Uvicorn server.

## 🌐 Installation & Setup

### Prerequisites
- Python 3.10+
- Pip (Python package manager)

### Local Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yahyatougui10-prog/web-oreinta.git
   cd web-oreinta
   ```

2. **Install dependencies**:
   ```bash
   pip install fastapi uvicorn jinja2 python-multipart
   ```

3. **Run the application**:
   ```bash
   python main.py
   ```

4. **Access the site**:
   Open your browser and navigate to `http://localhost:8000`

## 🗺️ Project Structure
```text
├── main.py              # FastAPI Application entry point
├── requests.json        # Local storage for contact requests
├── static/             # Static assets
│   ├── css/            # Custom premium styles
│   ├── js/             # Three.js & GSAP logic
│   └── images/         # High-resolution backgrounds
└── templates/          # Jinja2 HTML templates
```

## 🤝 Contact & Contribution
This project was designed to elevate the standards of orientation platforms. Contributions are welcome! Please open an issue or submit a pull request for any enhancements.

---
*Architectes de Carrières — Tissez votre destin.*
