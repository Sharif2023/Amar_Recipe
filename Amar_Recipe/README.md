# Amar Recipe

A modern, responsive recipe management platform built with React. This application allows users to browse and share recipes while providing administrators with powerful tools to moderate content and manage the platform.

## 🚀 Key Features

### User Features
- **Browse Recipes**: Explore a variety of recipes with a user-friendly interface.
- **Recipe Submission**: Users can submit their own recipes for approval.
- **Responsive Design**: Fully optimized unique interface for desktop and mobile devices.

### Admin Features
- **Dashboard**: Centralized hub for platform management.
- **Secure Authentication**: Dedicated admin login and signup systems.
- **Content Moderation**:
  - Review generic "Submission Requests" from users.
  - Approve or Reject recipes.
  - View detailed recipe information before publishing.
- **Management**:
  - Manage admin profiles.
  - View platform activity reports.
  - Track action history.
  - Configuration settings.
- **Communication**: Integrated chat functionality for admin coordination.

## 🛠️ Technology Stack

- **Frontend Framework**: [React](https://react.dev/) (v19)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Routing**: [React Router DOM](https://reactrouter.com/) (v7)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Linting**: ESLint

## 📦 Installation & Setup

Follow these lines to run the project locally.

### Prerequisites
- Node.js (Latest LTS recommended)
- npm (comes with Node.js)
- A local server environment (like XAMPP/WAMP) for the MySQL database.

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Amar_Recipe
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Locate the SQL file in the project root (e.g., `../sql`).
   - Import the SQL file into your MySQL database.
   - Ensure your backend API is configured to connect to the `Amar_Recipe` database.

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The application will start, typically at `http://localhost:5173`.

## 📁 Project Structure

```
Amar_Recipe/
├── src/
│   ├── Admin/          # Admin dashboard components and pages
│   ├── api/            # Backend API integration
│   ├── assets/         # Static assets
│   ├── Components/     # Reusable UI components
│   ├── Pages/          # Public facing pages
│   ├── App.jsx         # Main application component with Routing
│   └── main.jsx        # Entry point
├── public/             # Public assets
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── tailwind.config.js  # Tailwind configuration
```

## 📜 Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run lint`: Run ESLint to check for code quality issues.
- `npm run preview`: Preview the production build locally.
