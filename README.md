🐄 AI Animal Classifier
Upload an image of cattle or a buffalo — get an instant AI-powered classification report with breed identification, trait scoring, and productivity predictions.

📌 About
AI Animal Classifier is a web application that uses Google Gemini's vision AI to analyze images of cattle and buffaloes. It evaluates the animal's physical traits and generates a standardized classification report covering breed identification, overall score, longevity prediction, productivity, reproductive efficiency, and individual trait breakdowns with actionable recommendations.

✨ Features
🤖 AI-Powered Analysis
Identifies the breed of cattle or buffalo from an uploaded image
Generates an overall classification score
Predicts longevity, productivity, and reproductive efficiency
Breaks down individual physical traits with name, score, and description
Provides recommendations based on the analysis
👤 User Authentication
User sign up, login, and logout
Email verification flow
Password reset support
Session persisted via localStorage
🕓 Analysis History
Logged-in users get a history panel showing up to 10 past analyses
Each history item stores the image, timestamp, and full report
Click any past result to restore it instantly
Clear history with a single button
History is stored per user account in localStorage
🖼️ Image Uploader
Drag-and-drop or click-to-select image upload
Preview before analyzing
Clear and re-upload at any time
🛠️ Tech Stack
Layer	Technology
Framework	React + TypeScript
Build Tool	Vite
Styling	Tailwind CSS
AI / Vision	Google Gemini API (@google/genai)
State	React useState + useEffect
Persistence	localStorage (history & auth)
📊 Analysis Report Structure
Each analysis returns the following data:

Field	Description
breed	Identified breed name
overall_score	Standardized classification score (numeric)
longevity_prediction	Expected productive lifespan
productivity_prediction	Expected milk/meat productivity
reproductive_efficiency	Reproductive health assessment
traits[]	Array of physical traits, each with a name, score, and description
recommendations	AI-generated actionable recommendations
🚀 Getting Started
Prerequisites
Node.js v18 or higher
A Gemini API key — get one free at Google AI Studio
Installation
# 1. Clone the repository
git clone https://github.com/Kriti-here/ai-animal-classifier.git
cd ai-animal-classifier

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a .env.local file in the root and add:
# GEMINI_API_KEY=your_api_key_here

# 4. Start the development server
npm run dev
The app will be available at http://localhost:3000.

Build for Production
npm run build
npm run preview
📁 Project Structure
ai-animal-classifier/
├── components/
│   ├── Header.tsx          # Top nav with auth controls
│   ├── Footer.tsx          # Page footer
│   ├── ImageUploader.tsx   # Drag-and-drop image input
│   ├── AnalysisResult.tsx  # Displays the classification report
│   ├── Loader.tsx          # Loading spinner during analysis
│   └── HistoryPanel.tsx    # Sidebar with past analyses
├── services/
│   ├── geminiService.ts    # Gemini API call & response parsing
│   └── authService.ts      # Login, logout, signup, verification
├── types.ts                # TypeScript interfaces
├── App.tsx                 # Root component & state management
├── index.tsx               # React entry point
├── index.html              # HTML shell
├── vite.config.ts          # Vite configuration
└── tsconfig.json
⚙️ Environment Variables
Variable	Description
GEMINI_API_KEY	Your Google Gemini API key (required)
🤝 Contributing
Contributions are welcome! Here's how:

Fork the repository
Create a feature branch — git checkout -b feature/your-feature
Commit your changes — git commit -m "Add your feature"
Push and open a Pull Request
📄 License
This project is currently unlicensed. Contact the author for usage permissions.

AI Animal Classifier — Smarter livestock evaluation, powered by AI.
