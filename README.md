# Foundex - AI Startup Assessment Tool

## 📋 Overview

Foundex is a powerful web application designed to assess startup success potential using AI and social indicators. The platform analyzes startup data, founder information, and social media metrics to provide comprehensive insights and predictions about a startup's potential for success.

## ✨ Features

- **Startup Analysis**: Comprehensive evaluation of startup business models, market positioning, and growth trajectory
- **Founder Assessment**: Analysis of founder backgrounds, expertise, and team dynamics
- **Social Media Metrics**: Integration with social media platforms to analyze market presence and engagement
- **AI-Powered Predictions**: Advanced AI algorithms to predict success probability and growth patterns
- **SWOT Analysis**: Automatic generation of Strengths, Weaknesses, Opportunities, and Threats for each startup
- **Interactive Dashboard**: Visual representation of assessment data and metrics
- **Chat Interface**: AI-powered chat for asking questions about assessment results and additional insights
- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety and improved developer experience
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library built with Radix UI
- [Chart.js](https://www.chartjs.org/) and [Recharts](https://recharts.org/) - Data visualization
- [Framer Motion](https://www.framer.com/motion/) - Animations and transitions
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [React Hook Form](https://react-hook-form.com/) - Form validation and handling

### Backend
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - API endpoints
- [Neon Database](https://neon.tech/) - Serverless Postgres database
- [@neondatabase/serverless](https://www.npmjs.com/package/@neondatabase/serverless) - DB connection client
- [Zod](https://zod.dev/) - Schema validation
- [OpenAI SDK](https://www.npmjs.com/package/@ai-sdk/openai) - AI integration

### Development Tools
- [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- [ESLint](https://eslint.org/) - Code linting
- [TypeScript](https://www.typescriptlang.org/) - Static type checking

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) package manager

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/ai-startup-assessment.git
   cd ai-startup-assessment
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your API keys and database connection string.

4. Run the database setup script
   ```bash
   node scripts/db-check.js
   ```

5. Start the development server
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
pnpm build
pnpm start
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon Database connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `NEXT_PUBLIC_APP_URL` | Public URL of your application | No |

## 📡 API Endpoints

### Startups

- `GET /api/startups` - Get all startups
- `GET /api/startups/:id` - Get startup by ID
- `POST /api/startups` - Create a new startup
- `PUT /api/startups/:id` - Update a startup
- `DELETE /api/startups/:id` - Delete a startup

### Founders

- `GET /api/founders` - Get all founders
- `GET /api/founders/:id` - Get founder by ID
- `GET /api/startups/:id/founders` - Get founders by startup ID

### Assessment

- `GET /api/startups/:id/assessment` - Get assessment for a startup
- `POST /api/startups/:id/assessment` - Generate new assessment for a startup

### Chat

- `POST /api/chat` - Chat endpoint for AI assistant interactions

## 📁 Project Structure

```
ai-startup-assessment/
├── app/                 # Next.js App Router
│   ├── api/             # API routes
│   ├── components/      # React components
│   ├── lib/             # Utility functions
│   └── pages/           # Page components
├── components/          # Shared components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Shared utilities
│   ├── db.ts            # Database utilities
│   └── ai.ts            # AI utilities
├── public/              # Static assets
├── scripts/             # Utility scripts
│   └── db-check.js      # Database setup script
├── styles/              # Global styles
└── types/               # TypeScript types
```

## 💾 Database Schema

### Startups
- `id` - Primary key
- `name` - Startup name
- `description` - Startup description
- `website` - Website URL
- `founding_date` - Date founded
- `industry` - Industry category
- `funding_stage` - Current funding stage
- `total_funding` - Total funding amount
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

### Founders
- `id` - Primary key
- `name` - Founder name
- `email` - Email address
- `linkedin_url` - LinkedIn profile URL
- `twitter_url` - Twitter profile URL
- `instagram_url` - Instagram profile URL
- `bio` - Founder biography
- `startup_id` - Foreign key to startups table
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

### Assessment Results
- `id` - Primary key
- `startup_id` - Foreign key to startups table
- `success_score` - Numerical score (0-100)
- `strengths` - Identified strengths
- `weaknesses` - Identified weaknesses
- `opportunities` - Identified opportunities
- `threats` - Identified threats
- `recommendations` - AI-generated recommendations
- `created_at` - Record creation timestamp

## 🧩 Components

The application uses a component-based architecture with the following key components:

- `StartupList` - Displays a list of startups with filtering options
- `StartupDetails` - Shows detailed information about a selected startup
- `FounderList` - Displays founders associated with a startup
- `AssessmentResults` - Visualizes assessment metrics and SWOT analysis
- `ChatInterface` - Interactive AI chat interface for asking questions about startups
- `ResizableLayout` - Allows users to resize different sections of the interface

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for AI capabilities
- [Neon Database](https://neon.tech/) for serverless Postgres
- [Vercel](https://vercel.com/) for hosting and deployment
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components

---

© 2025 Foundex. All rights reserved.
