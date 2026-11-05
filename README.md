# ImpactPulse – Social Development Events Platform

**ImpactPulse** is a community-driven social development platform that connects people who want to make a positive impact in their communities. Users can create social service events, join volunteer activities, and manage their participation through a simple and user-friendly interface.

🌐 **Live Website:** [Add Your Live Website URL]

💻 **Client Repository:** [[Click Here](https://github.com/Irfan-Rakib/ImpactPulse-client)]

⚙️ **Server Repository:** [[Click Here](https://github.com/Irfan-Rakib/ImpactPulse-server)]

---

## ✨ Key Features

- **User Authentication:** Register and log in securely using Better Auth, with support for Google authentication when configured.
- **Create Social Events:** Authenticated users can create community service events with titles, descriptions, categories, locations, dates, and volunteer requirements.
- **Explore Events:** Browse available social development events and view their details.
- **Search and Filter:** Find events using search keywords and category filters.
- **Join Events:** Users can join events and become volunteers.
- **Leave Events:** Users can leave events they previously joined.
- **Personal Dashboard:** View event statistics and manage personal activities.
- **My Events:** Create, update, and delete events from a personal dashboard.
- **Joined Events:** Track all events that the user has joined.
- **Responsive Design:** Enjoy a user-friendly experience across desktop, tablet, and mobile devices.
- **Event Validation:** Validate event information, dates, image URLs, and volunteer capacity.
- **Community Impact:** Encourage people to participate in meaningful social activities and make a difference.

---

## 🛠️ Technologies Used

### Frontend

- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS
- Shadcn UI
- Better Auth Client

### Backend

- Node.js
- Express.js
- JavaScript (ES Modules)
- MongoDB
- MongoDB Node.js Driver
- Better Auth Session Verification

---

## 📁 Project Structure

```text
ImpactPulse/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── dashboard/
│   │   │   │   ├── create-event/
│   │   │   │   ├── edit-event/
│   │   │   │   ├── joined-events/
│   │   │   │   └── my-events/
│   │   │   ├── events/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   ├── next.config.ts
│   └── package.json
│
└── server/
    ├── index.js
    ├── .env
    └── package.json
```

---

## 🚀 Getting Started

Follow these instructions to run ImpactPulse locally.

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd ImpactPulse
```

### 3. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

CLIENT_URL=http://localhost:3000

BETTER_AUTH_URL=http://localhost:3000
```

Start the backend development server:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### 4. Setup the Frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env.local` file inside the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000

BETTER_AUTH_URL=http://localhost:3000
```

Configure Better Auth with your MongoDB connection and authentication providers. For Google authentication, add your Google OAuth credentials to the appropriate server-side environment configuration.

Start the frontend:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

---

## 🔗 API Endpoints

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| GET    | `/api/health`           | Check server status       |
| GET    | `/api/events`           | Get all events            |
| GET    | `/api/events/:id`       | Get event details         |
| POST   | `/api/events`           | Create an event           |
| PATCH  | `/api/events/:id`       | Update an event           |
| DELETE | `/api/events/:id`       | Delete an event           |
| POST   | `/api/events/:id/join`  | Join an event             |
| DELETE | `/api/events/:id/leave` | Leave an event            |
| GET    | `/api/my/events`        | Get user's created events |
| GET    | `/api/my/joined-events` | Get user's joined events  |

**Note:** Protected endpoints require a valid authenticated user session.

---

## 🔐 Environment Variables

Keep all sensitive credentials in environment files.

| Variable               | Description                            |
| ---------------------- | -------------------------------------- |
| `MONGODB_URI`          | MongoDB connection string              |
| `PORT`                 | Backend server port                    |
| `CLIENT_URL`           | Frontend application URL               |
| `BETTER_AUTH_URL`      | Better Auth server URL                 |
| `NEXT_PUBLIC_API_URL`  | Backend API URL for frontend requests  |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID, if enabled     |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret, if enabled |

**Security:** Never upload `.env` or `.env.local` files containing credentials to GitHub.

---

## 🌱 Project Purpose

ImpactPulse aims to make community service easier and more accessible by bringing volunteers and social development initiatives together on one platform.

Whether it is distributing winter clothes, providing food to people in need, organizing environmental campaigns, or supporting local communities, ImpactPulse helps people turn good intentions into meaningful actions.

---

## 🚀 Future Improvements

- Volunteer attendance tracking
- Event image upload functionality
- Admin dashboard and event moderation
- Volunteer contribution history
- Event notifications and reminders
- User profile management
- Event reviews and feedback

---

## 👨‍💻 Author

**Project Name:** ImpactPulse

**Project Type:** Social Development Events Platform

**Purpose:** Community Service and Volunteer Management

---

## 📄 License

This project is developed for educational and community development purposes.
