# Learnova 📚

A comprehensive peer-to-peer tutoring marketplace that bridges the gap between students seeking academic support and qualified tutors. The platform handles the entire tutoring workflow—from discovery and scheduling to messaging and post-session reviews.

## Core Features

* **Role-Based Workflows:** Distinct interfaces and capabilities for Students, Tutors, and Administrators.
* **Tutor Discovery & Specialization:** Search for tutors based on specific subjects, courses, and verified qualifications.
* **Availability & Scheduling:** Tutors can set recurring weekly availability. Students can book tutoring sessions based on real-time open slots.
* **Integrated Messaging System:** A built-in chat system allowing students and tutors to coordinate sessions without exposing private contact information.
* **Privacy-First Contact:** Granular controls for users to verify and toggle the public visibility of their phone numbers.
* **Reputation System:** Automated session tracking that allows students to leave 1-5 star ratings and reviews only after a session is completed.

## Tech Stack & Architecture

* **Database & Backend:** [Supabase](https://supabase.com/) / PostgreSQL
* **Authentication:** Supabase Auth (Role-based access control)
* **Storage:** Supabase Storage (Profile pictures and verification documents)
* **Frontend:** React Native
## Database Schema Highlights

The backend relies on a normalized PostgreSQL schema designed for scalability and data integrity:

* **Users & Roles:** Unified `users` table linked to specialized `students` and `tutors` profiles.
* **Session Management:** `tutoring_sessions` track the lifecycle of a booking (pending, confirmed, completed, canceled).
* **Conversations:** A decoupled `conversations`, `conversation_participants`, and `messages` architecture to support robust 1-to-1 or group messaging.

## Getting Started

### Prerequisites
* Node.js (v18+)
* A Supabase project instance

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/learnova.git](https://github.com/yourusername/learnova.git)
   cd learnova
