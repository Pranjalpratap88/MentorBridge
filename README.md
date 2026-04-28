# MentorBridge — The Nexus

A full-stack mentorship and knowledge-sharing platform connecting students, seniors, alumni, and industry mentors.

---

## Features

### For Students
- **Query Feed** — Ask questions publicly or target specific roles (seniors, alumni, mentors)
- **Networking** — Connect with seniors, alumni, and industry mentors
- **Resume Management** — Upload and get feedback on your resume
- **Leaderboard** — See top contributors in the community
- **Reputation System** — Earn points by helping others

### For Seniors, Alumni & Mentors
- **Answer Queries** — Help students and earn reputation points
- **Assigned Queries** — Receive targeted questions from students
- **Mentee Management** — Track and manage your mentee connections
- **Profile Showcase** — Display your expertise, company, and achievements

### For Administrators
- **Admin Panel** — Comprehensive dashboard with platform statistics
- **User Management** — View, lock, enable/disable user accounts
- **Feedback Management** — View and respond to user feedback
- **Query Oversight** — Monitor all queries and community activity

### Core Systems
- **Authentication** — Email/password with OTP verification, OAuth2 (Google, GitHub)
- **Notifications** — Real-time updates for query responses, assignments, and activity
- **Feedback System** — Users submit feedback, admins respond directly
- **Multi-role Support** — Student, Senior Student, Alumni, Mentor, Admin

---

## Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2.4**
- **Spring Security** — JWT authentication, OAuth2, role-based access control
- **Spring Data JPA** — Hibernate ORM with MySQL
- **MySQL 8** — Relational database
- **Lombok** — Reduce boilerplate
- **JavaMail** — OTP email verification

### Frontend
- **React 18** with **Vite**
- **React Router v6** — Client-side routing
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Smooth animations
- **Lucide React** — Icon library
- **Axios** — HTTP client

---

## Project Structure

```
MentorBridge/
├── backEnd/                          # Spring Boot backend
│   ├── src/main/java/com/myanatomy/sandboxpro/
│   │   ├── config/                   # Security, CORS, Admin initializer
│   │   ├── controller/               # REST API endpoints
│   │   ├── dto/                      # Data transfer objects
│   │   ├── exception/                # Global exception handling
│   │   ├── model/                    # JPA entities
│   │   ├── repository/               # Spring Data repositories
│   │   ├── security/                 # JWT, OAuth2, UserDetailsService
│   │   └── service/                  # Business logic
│   ├── src/main/resources/
│   │   ├── application-example.properties  # Template (copy to application.properties)
│   │   └── application.properties    # Your secrets (git-ignored)
│   └── pom.xml                       # Maven dependencies
│
├── frontEnd/                         # React frontend
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── assets/                   # Images
│   │   ├── components/common/        # Reusable components (Layout, ProtectedRoute)
│   │   ├── context/                  # React contexts (Auth, History)
│   │   ├── pages/                    # Page components
│   │   ├── services/                 # API clients
│   │   ├── App.jsx                   # Root component with routes
│   │   ├── index.css                 # Tailwind imports + global styles
│   │   └── main.jsx                  # React entry point
│   ├── index.html                    # HTML template
│   ├── package.json                  # npm dependencies
│   └── vite.config.js                # Vite configuration
│
├── .gitignore                        # Git ignore rules
└── README.md                         # This file
```

---

## Getting Started

### Prerequisites
- **Java 17+** — [Download](https://adoptium.net/)
- **Maven 3.8+** — [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **MySQL 8+** — [Download](https://dev.mysql.com/downloads/)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd MentorBridge
```

### 2. Database setup
Create a MySQL database:
```sql
CREATE DATABASE sandboxpro_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Backend configuration
```bash
cd backEnd/src/main/resources
cp application-example.properties application.properties
```

Edit `application.properties` and fill in:
- MySQL username/password
- JWT secret (generate a strong random string)
- Gmail SMTP credentials (use an [App Password](https://support.google.com/accounts/answer/185833))
- OAuth2 client IDs/secrets (optional)

### 4. Start the backend
```bash
cd backEnd
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

On first startup, an admin user is auto-created:
- **Username:** `admin`
- **Password:** `Admin@123`
- **Email:** `admin@mentorbridge.com`

### 5. Start the frontend
```bash
cd frontEnd
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Default Admin Credentials

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `Admin@123` |
| Email | `admin@mentorbridge.com` |

**⚠️ Change the admin password immediately in production!**

---

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login with username/email + password
- `POST /api/auth/verify-email` — Verify email with OTP
- `POST /api/auth/forgot-password` — Request password reset OTP
- `POST /api/auth/reset-password` — Reset password with OTP

### Users
- `GET /api/users/profile` — Get current user profile
- `PUT /api/users/profile` — Update profile
- `GET /api/users/leaderboard` — Get top users by reputation
- `GET /api/users/role/{role}` — Get users by role
- `GET /api/users/network` — Get network connections
- `GET /api/users/experts` — Search experts for private queries
- `GET /api/users/dashboard-stats` — Get user dashboard stats

### Queries
- `POST /api/queries` — Create a query
- `GET /api/queries` — Get all public queries
- `GET /api/queries/popular` — Get popular queries
- `GET /api/queries/unresolved` — Get unresolved queries
- `GET /api/queries/my` — Get current user's queries
- `GET /api/queries/role/{role}` — Get queries for specific role
- `GET /api/queries/{id}` — Get query with responses
- `POST /api/queries/{id}/responses` — Submit a response
- `PUT /api/queries/responses/{id}/best` — Mark response as best answer

### Notifications
- `GET /api/notifications` — Get all notifications
- `GET /api/notifications/unread` — Get unread notifications
- `GET /api/notifications/unread-count` — Get unread count
- `PUT /api/notifications/{id}/read` — Mark as read
- `PUT /api/notifications/read-all` — Mark all as read

### Feedback
- `POST /api/feedback` — Submit feedback (any user)
- `GET /api/feedback/my` — Get own feedback (any user)
- `GET /api/feedback` — Get all feedback (admin only)
- `GET /api/feedback/unreviewed` — Get unreviewed feedback (admin only)
- `POST /api/feedback/{id}/respond` — Respond to feedback (admin only)

### Admin
- `GET /api/users/admin/all` — Get all users
- `GET /api/users/admin/stats` — Get platform statistics
- `PUT /api/users/admin/{id}/toggle-lock` — Lock/unlock user
- `PUT /api/users/admin/{id}/toggle-enable` — Enable/disable user

---

## User Roles

| Role | Description | Capabilities |
|---|---|---|
| **STUDENT** | Current student (not final year) | Ask queries, view leaderboard, connect with mentors |
| **SENIOR_STUDENT** | Final year student | Answer queries, guide juniors, earn reputation |
| **ALUMNI** | Graduate working in industry | Mentor students, answer queries, share experience |
| **MENTOR** | Industry professional | Provide expert guidance, review resumes |
| **ADMIN** | System administrator | Manage users, view feedback, platform oversight |

---

## Development

### Backend
```bash
cd backEnd
mvn clean compile          # Compile
mvn spring-boot:run        # Run dev server
mvn clean package          # Build JAR
```

### Frontend
```bash
cd frontEnd
npm run dev                # Dev server with hot reload
npm run build              # Production build
npm run preview            # Preview production build
```

---

## Environment Variables

### Backend (`application.properties`)
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/sandboxpro_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

# JWT
app.jwt-secret=YOUR_SECRET_KEY

# Email
spring.mail.username=YOUR_GMAIL
spring.mail.password=YOUR_APP_PASSWORD

# OAuth2 (optional)
spring.security.oauth2.client.registration.google.client-id=...
spring.security.oauth2.client.registration.google.client-secret=...
```

---

## Security Notes

- **Never commit `application.properties`** — it's git-ignored for a reason
- Use **App Passwords** for Gmail, not your real password
- Generate a **strong JWT secret** (min 64 hex characters)
- Change the **default admin password** immediately
- Use **HTTPS** in production
- Set `spring.jpa.show-sql=false` in production

---

## Troubleshooting

### Backend won't start
- **Check MySQL is running:** `mysql -u root -p`
- **Verify database exists:** `SHOW DATABASES;`
- **Check application.properties** has correct credentials
- **Port 8080 in use:** Change `server.port` or kill the process

### Frontend won't connect to backend
- **CORS error:** Add your frontend URL to `SecurityConfig.corsConfigurationSource()`
- **401 Unauthorized:** Check JWT token is being sent in `Authorization` header
- **Network error:** Verify backend is running on `http://localhost:8080`

### Admin can't log in
- **Check admin was created:** Look for log message on backend startup
- **Database issue:** Run `SELECT * FROM users WHERE username='admin';`
- **Wrong password:** Default is `Admin@123` (case-sensitive)

### Back button not working
- Clear browser cache and reload
- Check browser console for errors
- Verify `HistoryProvider` wraps `<Routes>` in `App.jsx`

---

## License

MIT License — see LICENSE file for details.

---

## Contributors

Built with ❤️ by the MentorBridge team.

---

## Support

For issues, questions, or feature requests, use the in-app Feedback system or open a GitHub issue.
