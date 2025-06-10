
# MediAssistant 🩺✨

MediAssistant is an intelligent, multifaceted web application designed to serve as a comprehensive partner for various users within the healthcare ecosystem. It aims to simplify complexities, enhance knowledge, streamline workflows, and support well-being.

## Core Features

MediAssistant offers tailored experiences through different user modes:

*   **Patient/User Mode:**
    *   Symptom Checker (AI-powered insights via main UI or Chat)
    *   Medication Management & Reminders (including detailed "Do's and Don'ts" drug information)
    *   Personal Health Record (Lite - Conceptual)
    *   Appointment Management (Conceptual)
    *   Health & Wellness Tracking (Conceptual)
    *   Curated Health Library (Conceptual: OpenFDA, MedlinePlus Genetics, WHO ICD-10 integration)
    *   **AR Features (Conceptual):** AR Body Explorer, AR Condition Visualizer, Medication Effects Viewer, AR Child Health Educator.
*   **Medico (Medical Student) Mode:**
    *   **Study Aids:** Previous Question Papers, Study Notes Generator, High-Yield Topic Predictor, Flashcard Creator, Flowchart Creator (Conceptual), Mnemonics Generator, MCQ Generator. (Accessible via Medico Dashboard & Chat commands)
    *   **Planning & Tracking:** Study Timetable Creator, Progress Tracker (Conceptual).
    *   **Interactive Learning:** Clinical Case Simulations, Differential Diagnosis Trainer, Interactive Anatomy Visualizer, Virtual Patient Rounds.
    *   **Practice Tools:** Drug Dosage Calculator.
    *   **AR Features (Conceptual):** AR Anatomy Lab, Clinical Skills AR Tutor, Pathology Visuals, AR Surgical Steps Demo, Augmented Flashcards.
*   **Professional (Clinician) Mode:**
    *   **Clinical Decision Support:** AI-Powered Differential Diagnosis Assistant, Evidence-Based Treatment Protocol Navigator.
    *   **Workflow Optimization:** Advanced Pharmacopeia & Interaction Checker, Smart Dictation & Note Assistant, Quick Discharge Summary Generator, Rounds Tool, Referral Streamliner, On-Call Handover Assistant.
    *   **Knowledge Enhancement:** AI-Powered Research & Literature Summarizer.
    *   **AR Features (Conceptual):** AR Anatomy Overlay, AR Clinical Guides, 3D Organ Viewer, AR Patient Education, Emergency Triage AR Cards.
*   **Common Features:**
    *   **AR Viewer:** General image analysis ("Snapshot & Analyze" live feed, or upload images) with AI annotations. Conceptually supports role-specific AR tools.
    *   **Advanced AI Chat:** Conversational AI with tool usage (e.g., symptom analysis, Medico commands).
    *   User Feedback System.
    *   Dedicated Notifications Page.
    *   Global Clock Widget in header (Clock, Timer, Reminders).
    *   Dynamic "Hello," greeting on homepage with Firebase/Gemini-inspired gradient.

## Design Philosophy

The app embraces a clean, modern, professional, and highly aesthetic design language, drawing inspiration from Apple's UI clarity and Google's AI product presentation styles. It prioritizes user-friendliness and an intuitive experience.

## Tech Stack

*   **Frontend:** Next.js (App Router), React, TypeScript
*   **Styling:** Tailwind CSS, ShadCN UI Components
*   **AI Integration:** Genkit (with Google AI/Gemini models), Custom MedGemma endpoint via Firebase Cloud Functions.
*   **Backend & Database:** Firebase (Authentication, Firestore, Cloud Functions, Cloud Storage, Hosting, FCM)
*   **External APIs (Conceptual/Implemented):** OpenFDA, MedlinePlus Genetics, WHO ICD-10, Hugging Face (for specialized models via Cloud Functions).

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

        # Optional: Direct Gemini API endpoint (for fallback in chat)
        # NEXT_PUBLIC_GEMINI_API_ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

        # Other API Keys (if you implement them)
        # HUGGING_FACE_API_KEY=your_hugging_face_api_key (for functions config, not .env)
        # HIPAASPACE_API_KEY=your_hipaaspace_api_key (for functions config, not .env)
        ```
    *   **Important:** For API keys used in Firebase Cloud Functions (like `HUGGING_FACE_API_KEY`, `HIPAASPACE_API_KEY`, or MedGemma configuration), set them using Firebase Functions configuration for security:
        ```bash
        firebase functions:config:set yourservice.api_key="YOUR_ACTUAL_KEY"
        # e.g., firebase functions:config:set huggingface.api_key="hf_..."
        # e.g., firebase functions:config:set hipaaspace.key="YOUR_HIPAASPACE_TOKEN"

        # For MedGemma integration (see "Using MedGemma Model" section below):
        firebase functions:config:set medgemma.project_id="YOUR_MEDGEMMA_PROJECT_ID"
        firebase functions:config:set medgemma.location_id="YOUR_MEDGEMMA_LOCATION_ID"
        firebase functions:config:set medgemma.endpoint_id="YOUR_MEDGEMMA_ENDPOINT_ID"
        ```

3.  **Install Dependencies:**
    *   Next.js app: `npm install`
    *   Firebase Functions: `cd functions && npm install && cd ..`

4.  **Run the Development Server:**
    *   For the Next.js app: `npm run dev`
    *   For Genkit (if running flows locally for testing): `npm run genkit:dev`
    *   For Firebase Emulators (including functions): `firebase emulators:start`

5.  **Build and Deploy:**
    *   Build the Next.js app: `npm run build`
    *   Deploy to Firebase: `firebase deploy` (This will typically deploy Hosting, Functions, Firestore rules, etc., based on your `firebase.json` configuration).

## Using MedGemma Model

This application can be configured to use a custom-deployed MedGemma model on Vertex AI for specific tasks.

1.  **Deploy MedGemma on Vertex AI:**
    *   Use the Google Cloud Console or a Python script (as previously discussed) to deploy the `google/medgemma@medgemma-4b-it` model (or your preferred MedGemma version) from the Model Garden to a Vertex AI Endpoint.
    *   **Note your Project ID, Location ID (e.g., `us-central1`), and the Endpoint ID of your deployed MedGemma model.** You can find the Endpoint ID in the Vertex AI > Endpoints section of the Google Cloud Console after deployment.

2.  **Configure Firebase Cloud Functions:**
    *   Set the following environment configuration variables for your Firebase project, replacing the placeholder values with your actual MedGemma deployment details:
        ```bash
        firebase functions:config:set medgemma.project_id="YOUR_GOOGLE_CLOUD_PROJECT_ID_HOSTING_MEDGEMMA"
        firebase functions:config:set medgemma.location_id="YOUR_MEDGEMMA_ENDPOINT_LOCATION_ID" # e.g., us-central1
        firebase functions:config:set medgemma.endpoint_id="YOUR_MEDGEMMA_VERTEX_AI_ENDPOINT_ID"
        ```
    *   After setting these, redeploy your functions: `firebase deploy --only functions`

3.  **Integration:**
    *   The application includes a Firebase Cloud Function (`invokeMedGemma`) that uses the Node.js Vertex AI SDK to call your configured MedGemma endpoint.
    *   Future development can involve creating Genkit tools or modifying existing flows to call this `invokeMedGemma` function for specific medical AI tasks, allowing targeted use of MedGemma's capabilities.

## Troubleshooting Common Issues

### Google AI / Genkit Errors (e.g., 403 Forbidden, API_KEY_SERVICE_BLOCKED)

If you encounter errors like `[GoogleGenerativeAI Error]: Error fetching from ... [403 Forbidden] Requests to this API generativelanguage.googleapis.com ... are blocked` or similar:

This usually means there's an issue with your Google Cloud Project configuration for the API key (`GOOGLE_API_KEY` in `.env`) being used by Genkit for the Generative Language API (Gemini models). The error message often includes your project ID (e.g., `consumer":"projects/YOUR_PROJECT_ID"`).

**Action Required in Google Cloud Console for project `YOUR_PROJECT_ID`:**

1.  **Enable the API:**
    *   Go to the Google Cloud Console: [https://console.cloud.google.com/](https://console.cloud.google.com/)
    *   Ensure you have the correct project selected.
    *   Navigate to "APIs & Services" > "Library".
    *   Search for "**Generative Language API**" (it might also be listed as "Google AI Generative Language API" or similar).
    *   Click on it and ensure it is **Enabled**. If not, enable it.
    *   _Alternatively, if you plan to use models via Vertex AI, ensure the "Vertex AI API" is enabled._

2.  **Check Billing:**
    *   Most Google Cloud APIs, including generative AI services, require a billing account to be linked to your project and billing to be enabled.
    *   Navigate to "Billing" in the Google Cloud Console and verify that your project is associated with an active billing account.

3.  **Regenerating or Restricting Your API Key:**
    *   If you suspect your API key is compromised or misconfigured, you can regenerate it:
        *   Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials) in the Google Cloud Console.
        *   Click on “+ CREATE CREDENTIALS” → “API Key”.
        *   Copy the new key and update it in your `.env` file.
    *   **Restrict your API Key (Recommended):**
        *   On the Credentials page, click the name of your API key.
        *   Under "API restrictions," select "Restrict key" and choose "Generative Language API" (and any other APIs you need for this key).
        *   Under "Application restrictions," you can set HTTP referrers (for web clients), IP addresses (for servers), or other appropriate restrictions. For server-side use (like Genkit), IP restrictions might be relevant if your server has a static IP.

4.  **Valid API Key:**
    *   Double-check that the `GOOGLE_API_KEY` in your `.env` file (for local development) or your environment configuration (for deployed environments) is correct and has not expired or been revoked.

After making any necessary changes in the Google Cloud Console, it might take a few minutes for them to propagate. Then, try running your application again.

### Vertex AI / MedGemma Endpoint Errors

If you encounter errors when trying to invoke the MedGemma model via the `invokeMedGemma` Cloud Function:

1.  **Check Firebase Functions Logs:** Use `firebase functions:log` or the Firebase console to see detailed error messages from the `invokeMedGemma` function.
2.  **Verify MedGemma Configuration:**
    *   Ensure `medgemma.project_id`, `medgemma.location_id`, and `medgemma.endpoint_id` are correctly set in your Firebase Functions environment configuration (see "Using MedGemma Model" section).
    *   Double-check the Endpoint ID in the Vertex AI > Endpoints section of your Google Cloud Console.
3.  **Cloud Function Permissions:**
    *   The service account used by your Firebase Cloud Function (usually `PROJECT_ID@appspot.gserviceaccount.com`) needs permissions to interact with Vertex AI. The **"Vertex AI User"** role (or a custom role with `aiplatform.endpoints.predict` permission) on the project hosting MedGemma is typically required.
    *   If your MedGemma endpoint is in a *different* Google Cloud project than your Firebase project, ensure cross-project permissions are correctly configured.
4.  **Vertex AI Endpoint Status:**
    *   In the Google Cloud Console, navigate to Vertex AI > Endpoints.
    *   Check the status of your MedGemma endpoint. Ensure it's active and healthy. View its logs for any deployment or serving issues.
5.  **Input/Output Format:**
    *   The MedGemma model deployed via a VLLM container expects a specific JSON input format (usually `{"instances": [{"prompt": "..."}]}`) and produces a specific JSON output format. The `invokeMedGemma` function attempts to handle a common structure, but if your serving container has a different expectation, the function might need adjustment.

## Project Structure (Simplified Overview)

*   `src/app/`: Next.js App Router pages and layouts.
    *   `(auth)/`: Login and Signup pages.
    *   `ar-viewer/`: Augmented Reality viewer page (conceptual tools, image analysis).
    *   `chat/`: AI Chat interface.
    *   `medications/`: Medication management tools.
    *   `medico/`: Medico Study Hub dashboard and tools.
    *   `pro/`: Professional Clinical Suite dashboard and tools.
    *   `notifications/`: Dedicated notifications page.
    *   `profile/`: User profile page.
    *   `settings/`: Application settings page.
*   `src/components/`: Reusable UI components.
    *   `layout/`: Core layout components (Header, Sidebar, Footer, GlobalClockWidget, etc.).
    *   `homepage/`: Components specific to the main landing page (Hero, ModeSwitcher, etc.).
    *   `medico/`: Components for the Medico Study Hub tools.
    *   `pro/`: Components for the Professional Clinical Suite tools.
    *   `chat/`: Chat interface components.
    *   `medications/`: Medication management components.
    *   `ar-viewer/` (or `image-analyzer/`): Components for image upload/analysis.
    *   `ui/`: ShadCN UI components.
*   `src/ai/`: Genkit flows, schemas, and AI-related logic.
    *   `flows/`: Genkit flow definitions (chat, symptom analysis, medico tools, pro tools).
    *   `schemas/`: Zod schemas for flow inputs/outputs.
    *   `tools/`: Genkit tool definitions (e.g., symptom analyzer tool for chat).
*   `src/contexts/`: React context providers (e.g., `ProModeContext`, `ThemeProvider`).
*   `src/hooks/`: Custom React hooks (e.g., `useToast`, `useMobile`).
*   `src/lib/`: Utility functions (e.g., `cn`, `firebase.ts`).
*   `src/types/`: TypeScript type definitions (e.g., `medication.ts`, `notifications.ts`, `ar-tools.ts`).
*   `src/config/`: Application-specific configurations (e.g., `ar-tools-config.ts`).
*   `public/`: Static assets (images, manifest.json, sw.js).
*   `functions/`: Firebase Cloud Functions (e.g., `searchDrug`, `searchGene`, `searchICD10`, `healthCheck`, `invokeMedGemma`).

## Contributing

This is a project in active development. Contributions and suggestions are welcome! (Standard contributing guidelines would go here if it were a public project).

## License

(Specify your license if applicable, e.g., MIT, Apache 2.0, or proprietary).
For now, this is a private project for development in Firebase Studio.
