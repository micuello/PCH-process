# PCH Process Flow

A Next.js application that visualizes the PCH supply chain process flow across three main phases: Forecasting, Booking, and Planning & Warehouse Execution.

## Features

- **Interactive Process Visualization** - Click to expand/collapse detailed information for each step
- **Color-Coded Actors** - Different colors represent different actors (PCH, CSA TH, Cargoo, Carriers, etc.)
- **Three Main Phases**:
  - Phase 1: Forecasting
  - Phase 2: Booking Process
  - Phase 3: Planning & Warehouse Execution
- **Data Flow Summary** - Visual summary of data flows between actors
- **Responsive Design** - Works on desktop and mobile devices

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Option 2: Connect to GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your repository
5. Click "Deploy"

### Option 3: Using Git Push

Once linked to Vercel, any push to your main branch will automatically deploy.

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main process flow component
│   └── globals.css         # Global styles and CSS variables
├── package.json            # Dependencies and scripts
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── README.md              # This file
```

## Building for Production

```bash
npm run build
npm start
```

## Dependencies

- **Next.js 15** - React framework
- **React 18** - UI library
- **Tabler Icons React** - Icon library
- **DM Sans Font** - Typography (from Google Fonts)

## Customization

### Colors
Modify the phase colors in `app/page.tsx`:
```typescript
const phases = [
  {
    id: "forecast",
    color: "#0F6E56",
    bgColor: "#E1F5EE",
    // ...
  }
]
```

### CSS Variables
Update global CSS variables in `app/globals.css`:
```css
--color-background-primary: #ffffff;
--color-text-primary: #1a1a1a;
/* ... */
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Support

For questions or issues, please check the repository or contact the team.
