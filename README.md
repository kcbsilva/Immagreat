# Immagreat 🎓

Immagreat is a modern, full-stack platform designed for providing online English classes. It leverages real-time video streaming and a structured management system to connect teachers and students in a seamless virtual classroom environment.

## 🚀 Features

- **Real-time Virtual Classrooms**: Powered by LiveKit for low-latency video and audio streaming.
- **Role-Based Access Control**: Tailored experiences for Students, Teachers, and Moderators.
- **Session Management**: Create, manage, and track classroom sessions and enrollments.
- **Responsive Design**: Built with Tailwind CSS v4 for a modern, mobile-friendly interface.
- **Robust Backend**: Next.js App Router for server-side logic and Prisma for database orchestration.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (React 19), Tailwind CSS v4, Lucide Icons
- **Backend**: Next.js API Routes, Prisma ORM
- **Real-time Communication**: LiveKit Server, CoTurn (STUN/TURN)
- **Database**: PostgreSQL
- **Authentication**: JWT-based auth (jose, bcryptjs)
- **Containerization**: Docker & Docker Compose

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop)
- [npm](https://www.npmjs.com/)

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/immagreat.git
    cd immagreat
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Copy the example environment file and fill in your credentials:

    ```bash
    cp .env.example .env
    ```

4.  **Start Infrastructure:**
    Spin up PostgreSQL and LiveKit using Docker:

    ```bash
    docker-compose up -d
    ```

5.  **Database Migration:**
    Generate the Prisma client and push the schema to your database:

    ```bash
    npm run db:generate
    npm run db:migrate
    ```

6.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `app/`: Next.js App Router (pages, components, and API routes).
  - `landing/`: Public marketing pages.
  - `students/`: Student-specific dashboard and views.
  - `teachers/`: Teacher-specific dashboard and classroom controls.
  - `api/`: Backend endpoints (Auth, LiveKit tokens).
- `prisma/`: Database schema and migration files.
- `infra/`: Infrastructure configuration (e.g., LiveKit yaml).
- `public/`: Static assets.

## 📄 License

This project is private and proprietary.
