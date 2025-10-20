# 🏆 Sports Event Management App

A modern **Sports Event Management** platform built with **Next.js 15**, **TypeScript**, **Supabase**, and **shadcn/ui**.

Users can log in with Google, create and manage sports events, and assign venues — all through a secure, responsive dashboard.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database & Auth** | Supabase |
| **UI Library** | shadcn/ui |
| **Styling** | Tailwind CSS |
| **Forms & Validation** | React Hook Form + Zod |
| **Notifications** | Sonner |
| **Deployment** | Vercel |

---

## ✨ Features

### 🔐 Authentication
- Google Sign-In (email/password “Coming Soon”)
- Protected routes (redirects unauthenticated users to login)
- Logout functionality

### 🏟️ Event Management
- Create, edit, and delete sports events
- Event fields include:
  - Name
  - Sport Type (Soccer, Basketball, Tennis, etc.)
  - Date & Time
  - Description
  - Multiple Venues
- Each user can only manage their own events (enforced via Supabase Row Level Security)

### 📅 Dashboard
- Displays all events with sport, venue, and date details
- Search by name and filter by sport
- Edit/Delete buttons shown only for events you own
- Responsive grid layout

### 🗺️ Venues
- Reusable venue entities
- Linked to events through a many-to-many relationship (`event_venues`)

## 🧰 Setup & Installation

### 1️⃣ Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

### 2️⃣ Install dependencies
npm install

### 3️⃣ Create a Supabase project
- Go to Supabase Dashboard
- Create a new project
- Copy your project URL and API keys

### 4️⃣ Add environment variables

Create a `.env.local` file in the root of your project:

NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

### 5️⃣ Run locally
npm run dev

Then open 👉 http://localhost:3000

---

## 🗄️ Database Schema

### `events`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Event ID |
| name | Text | Event name |
| sport_type | Text | Type of sport |
| starts_at | Timestamptz | Date and time |
| description | Text | Optional description |
| owner_id | UUID (FK) | References `auth.users.id` |

### `venues`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Venue ID |
| name | Text | Venue name |
| city | Text | City name |

### `event_venues`
| Column | Type | Description |
|--------|------|-------------|
| event_id | UUID | FK → events.id |
| venue_id | UUID | FK → venues.id |

---

## 🔒 Security (RLS)

- Each event is tied to its creator (`owner_id`)
- Only owners can edit or delete their own events
- Authenticated users can view all events
- Event-to-venue relationships are only modifiable by the event owner

---

## 🧠 Future Enhancements

- [ ] User Profile Page (“My Events”)
- [ ] Public Event View (read-only)
- [ ] Venue CRUD Management
- [ ] Event Analytics Dashboard
- [ ] Email/Password login (coming soon)

---

## 👨‍💻 Author

**Zachary Rubin**  
Full-Stack Developer • Software Engineer
🐙 [GitHub](https://github.com/zscrub)
💼 [LinkedIn](https://www.linkedin.com/in/zachary-rubin-453a98217/)

---

## 🏁 License

This project is open source and available under the [MIT License](LICENSE).
