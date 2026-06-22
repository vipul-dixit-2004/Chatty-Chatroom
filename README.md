# 💬 Chatty — Realtime Chatroom

Chatty is a lightweight, password-protected realtime chatroom web app. Spin up a room in seconds, share the invite link, and chat live — with an AI assistant built right in.

## Features

- **Instant room creation** — generate a unique Room ID and protect it with a passkey
- **Realtime messaging** — powered by Firebase Firestore (`onSnapshot` listeners, no polling)
- **Secure passkeys** — passkeys are hashed with `bcryptjs` before being stored, never saved in plaintext
- **ChattyAI assistant** — mention `@ai <message>` in any room to get a response from a Gemini-powered bot
- **Smart code rendering** — AI responses containing code are auto-detected and shown in a code block with a one-click copy button
- **Clean chat UX** — grouped messages by sender, date separators, and auto-scroll to the latest message
- **Shareable invite links** — copy a direct link to the room with one click
- **Dockerized** — ships with a multi-stage `Dockerfile` and a GitHub Actions CI/CD pipeline for automated build + deploy

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) + React 19 |
| Styling | Tailwind CSS 4 |
| Database | Firebase Firestore (realtime) |
| AI | Google Generative AI — Gemini 2.5 Flash |
| Security | bcryptjs (passkey hashing) |
| Deployment | Docker, GitHub Actions, Cloudflare Tunnel |

## How It Works

1. **Home page (`/`)** — Create a new room (sets a passkey, hashes it, stores the room in a Firestore `ChatRooms` collection) or join an existing one by Room ID.
2. **Chatroom page (`/chatroom/[roomId]`)** — Prompts for a nickname and the room passkey, verifies it against the stored hash, then unlocks the live chat.
3. **Messages** are written to a `messages` subcollection under each room document and streamed to every participant in realtime.
4. **ChattyAI** — Any message containing `@ai` is sent to the `/api/chatty` route, which forwards it to a per-room Gemini chat session and posts the reply back into the room as "Chatty".

## Project Structure

```
src/
├── app/
│   ├── page.js                    # Home — create / join room
│   ├── chatroom/[roomId]/page.js  # Chatroom UI, auth, message list
│   ├── api/chatty/route.js        # ChattyAI API endpoint
│   └── components/MessageTextBox.js  # Renders text or code-block messages
├── hooks/
│   └── useRoomMessages.js         # Realtime Firestore message listener
├── lib/
│   └── firebase.js                # Firebase app initialization
├── server/
│   └── chattyAI.js                # Gemini chat session management
└── utils/
    └── sendMessage.js             # Writes messages, triggers ChattyAI
```

## Getting Started

### Prerequisites

- Node.js 20+
- A [Firebase](https://firebase.google.com/) project with Firestore enabled
- A [Google Gemini API key](https://ai.google.dev/)

### 1. Clone the repo

```bash
git clone https://github.com/vipul-dixit-2004/Chatty-Chatroom.git
cd Chatty-Chatroom
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Firebase config (client-side)
NEXT_PUBLIC_apiKey=your_firebase_api_key
NEXT_PUBLIC_authDomain=your_project.firebaseapp.com
NEXT_PUBLIC_projectId=your_project_id
NEXT_PUBLIC_storageBucket=your_project.appspot.com
NEXT_PUBLIC_messagingSenderId=your_sender_id
NEXT_PUBLIC_appId=your_app_id
NEXT_PUBLIC_measurementId=your_measurement_id

# Gemini API key (server-side only)
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Using ChattyAI

Inside any room, type:

```
@ai write a function that reverses a string
```

Chatty will reply in the room. Code responses are automatically detected and rendered in a copyable code block.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with Turbopack |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Docker

Build and run the production image locally:

```bash
docker build \
  --build-arg NEXT_PUBLIC_apiKey=your_api_key \
  --build-arg NEXT_PUBLIC_authDomain=your_auth_domain \
  --build-arg NEXT_PUBLIC_projectId=your_project_id \
  --build-arg NEXT_PUBLIC_storageBucket=your_storage_bucket \
  --build-arg NEXT_PUBLIC_messagingSenderId=your_sender_id \
  --build-arg NEXT_PUBLIC_appId=your_app_id \
  --build-arg NEXT_PUBLIC_measurementId=your_measurement_id \
  -t chatty .

docker run -d -p 3000:3000 -e GEMINI_API_KEY=your_gemini_key chatty
```

### CI/CD

`.github/workflows/cicd.yaml` automatically builds the Docker image, pushes it to Docker Hub, and deploys it to a remote server over SSH (via a Cloudflare Tunnel) on every push to `main`. Configure the following repository secrets to use it:

`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `SSH_PRIVATE_KEY`, `SERVER_USER`, `GEMINI_API_KEY`, and the `NEXT_PUBLIC_*` Firebase variables.

## License

No license has been specified for this project yet.

## Author

Built by [Vipul Dixit](https://github.com/vipul-dixit-2004).
