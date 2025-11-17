# Noise2Signal Hackathon - UI

A modern React web application built with Vite for the Noise2Signal Hackathon.

## Team Members
- [Add team member names here]

## Project Description
[Add your project description here]

## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Styling:** CSS3 (with modern features)
- **Linting:** ESLint

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher) - [Download here](https://nodejs.org/)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/N2S-Hackathon/UI.git
cd UI
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
# Create a .env file in the root directory
# Copy from .env.example and fill in your values
VITE_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

The app will open at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
UI/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable React components
│   ├── App.jsx      # Main App component
│   ├── App.css      # App styles
│   ├── main.jsx     # Entry point
│   └── index.css    # Global styles
├── index.html       # HTML template
├── vite.config.js   # Vite configuration
└── package.json     # Dependencies and scripts
```

## Development Workflow

### For Team Members:

1. **Pull latest changes**
```bash
git pull origin main
```

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes and test locally**
```bash
npm run dev
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: description of your feature"
```

5. **Push your branch**
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request** on GitHub for review

### Commit Message Convention

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Deployment

The app can be easily deployed to:
- **Vercel** - `npm run build` then connect to GitHub
- **Netlify** - Connect repository and set build command to `npm run build`
- **GitHub Pages** - Use GitHub Actions workflow

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)

## License
[Add license if applicable]

