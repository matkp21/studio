
# MediAssistant 🩺✨

MediAssistant is an intelligent, multifaceted web application designed to serve as a comprehensive partner for various users within the healthcare ecosystem. It aims to simplify complexities, enhance knowledge, streamline workflows, and support well-being.

## Core Features

MediAssistant offers tailored experiences through different user modes:

*   **Patient/User Mode:**
    *   Symptom Checker (AI-powered insights)
    *   Medication Management & Reminders
    *   Personal Health Record (Lite)
    *   Appointment Management
    *   Health & Wellness Tracking
    *   Curated Health Library (OpenFDA, MedlinePlus Genetics, WHO ICD-10 integration)
*   **Medico (Medical Student) Mode:**
    *   **Study Aids:** Previous Question Papers, Study Notes Generator, High-Yield Topic Predictor, Flashcard Creator, Flowchart Creator (Conceptual), Mnemonics Generator, MCQ Generator.
    *   **Planning & Tracking:** Study Timetable Creator, Progress Tracker (Conceptual).
    *   **Interactive Learning:** Clinical Case Simulations, Differential Diagnosis Trainer, Interactive Anatomy Visualizer, Virtual Patient Rounds.
    *   **Practice Tools:** Drug Dosage Calculator.
*   **Professional (Clinician) Mode:**
    *   **Clinical Decision Support:** AI-Powered Differential Diagnosis Assistant, Evidence-Based Treatment Protocol Navigator.
    *   **Workflow Optimization:** Advanced Pharmacopeia & Interaction Checker, Smart Dictation & Note Assistant, Quick Discharge Summary Generator, Rounds Tool, Referral Streamliner, On-Call Handover Assistant.
    *   **Knowledge Enhancement:** AI-Powered Research & Literature Summarizer.
*   **Common Features:**
    *   AR Viewer (Conceptual)
    *   Advanced AI Chat
    *   User Feedback System
    *   Dedicated Notifications Page

## Design Philosophy

The app embraces a clean, modern, professional, and highly aesthetic design language, drawing inspiration from Apple's UI clarity and Google's AI product presentation styles. It prioritizes user-friendliness and an intuitive experience.

## Tech Stack

*   **Frontend:** Next.js (App Router), React, TypeScript
*   **Styling:** Tailwind CSS, ShadCN UI Components
*   **AI Integration:** Genkit (with Google AI/Gemini models)
*   **Backend & Database:** Firebase (Authentication, Firestore, Cloud Functions, Cloud Storage, Hosting, FCM)
*   **External APIs (Conceptual/Implemented):** OpenFDA, MedlinePlus Genetics, WHO ICD-10, Hugging Face (for specialized models like MedGemma via Cloud Functions).

## Getting Started

This project is set up to run in Firebase Studio.

1.  **Prerequisites:**
    *   Node.js (v18+ recommended)
    *   Firebase CLI installed and configured (`npm install -g firebase-tools`, `firebase login`)
    *   A Firebase project set up with Authentication, Firestore, Cloud Functions, Hosting, and Storage enabled.

2.  **Environment Variables:**
    *   Create a `.env` file in the root of your project.
    *   Add your Firebase project configuration and any necessary API keys:
        ```env
        # Firebase Client SDK Config (from your Firebase project settings)
        NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
        NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id # Optional, for Analytics

        # Genkit/Google AI API Key (if not configured via gcloud CLI)
        GOOGLE_API_KEY=your_google_ai_api_key
        # or specific Genkit environment variables as needed

        # Other API Keys (if you implement them)
        # HUGGING_FACE_API_KEY=your_hugging_face_api_key (for functions config, not .env)
        # HIPAASPACE_API_KEY=your_hipaaspace_api_key (for functions config, not .env)
        ```
    *   **Important:** For API keys used in Firebase Cloud Functions (like `HUGGING_FACE_API_KEY` or `HIPAASPACE_API_KEY`), set them using Firebase Functions configuration for security:
        ```bash
        firebase functions:config:set yourservice.api_key="YOUR_ACTUAL_KEY"
        # e.g., firebase functions:config:set huggingface.api_key="hf_..."
        ```

3.  **Install Dependencies:**
    ```bash
    npm install
    # If you have a functions directory, also:
    # cd functions && npm install && cd ..
    ```

4.  **Run the Development Server:**
    *   For the Next.js app:
        ```bash
        npm run dev
        ```
    *   For Genkit (if running flows locally for testing):
        ```bash
        npm run genkit:dev
        ```
        (Ensure your `src/ai/dev.ts` is configured correctly).

5.  **Build and Deploy:**
    *   Build the Next.js app:
        ```bash
        npm run build
        ```
    *   Deploy to Firebase:
        ```bash
        firebase deploy
        ```
        (This will typically deploy Hosting, Functions, Firestore rules, etc., based on your `firebase.json` configuration).

## Project Structure (Simplified Overview)

*   `src/app/`: Next.js App Router pages and layouts.
*   `src/components/`: Reusable UI components.
    *   `layout/`: Core layout components (Header, Sidebar, Footer, etc.).
    *   `homepage/`: Components specific to the main landing page.
    *   `medico/`: Components for the Medico Study Hub.
    *   `pro/`: Components for the Professional Clinical Suite.
    *   `ui/`: ShadCN UI components.
*   `src/ai/`: Genkit flows, schemas, and AI-related logic.
    *   `flows/`: Genkit flow definitions.
    *   `schemas/`: Zod schemas for flow inputs/outputs.
    *   `tools/`: Genkit tool definitions.
*   `src/contexts/`: React context providers (e.g., `ProModeContext`).
*   `src/hooks/`: Custom React hooks.
*   `src/lib/`: Utility functions.
*   `src/types/`: TypeScript type definitions.
*   `public/`: Static assets (images, manifest.json, sw.js).
*   `functions/`: Firebase Cloud Functions (for traditional backend tasks and API integrations outside Genkit).

## Contributing

This is a project in active development. Contributions and suggestions are welcome! (Standard contributing guidelines would go here if it were a public project).

## License

(Specify your license if applicable, e.g., MIT, Apache 2.0, or proprietary).
For now, this is a private project for development in Firebase Studio.
```