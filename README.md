# Library Management System - Frontend

A modern, responsive web application built with Next.js for managing library operations with role-based access control.

## 🚀 Features

### User Features
- **Secure Authentication**: JWT-based login and registration system
- **Advanced Book Discovery**: Browse and search books with multiple filters
  - Search by category, author, genre, and language
  - Dynamic filtering with real-time updates
- **Book Reservation**: Reserve books for 7, 14, or 21 days
- **Personal Dashboard**: View reservation history and profile information

### Librarian Features
- **Admin Dashboard**: Centralized control panel for library operations
- **Book Management**: Complete CRUD operations for book catalog
- **Category Management**: Create and manage book categories
- **Inventory Control**: Update book status and availability
- **User Management**: View registered users and manage blacklist status

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: React Context API
- **HTTP Client**: Axios / Fetch API
- **Authentication**: JWT (JSON Web Tokens)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v18 or higher
- **npm** or **yarn**: Latest version
- **Git**: For version control

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/library-frontend.git
   cd library-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8083
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8083/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)


## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_GATEWAY_URL` | API Gateway base URL | `http://localhost:8083` |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:8082/api` |

## 🎯 Available Scripts

```bash

# Development server
npm run dev


## 🔐 Authentication Flow

1. User registers via `/signup` endpoint
2. User logs in with credentials
3. Backend returns JWT token
4. Token is stored in Context API and localStorage
5. Token is included in all subsequent API requests
6. Protected routes check authentication status

## 🎨 UI Components

The application uses a component-based architecture with reusable UI elements:

- **Forms**: Login, Signup, Book Creation, Category Management
- **Cards**: Book cards with cover images and details
- **Modals**: Confirmation dialogs, Reservation options
- **Filters**: Multi-select dropdowns for book discovery
- **Navigation**: Role-based navigation menus


# Run Frontend
Get Terminal and type "npm run dev"

# Start production server
Go LibraryManagementApplication and Right click -> click Run java
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Conventions

- Use functional components with React Hooks
- Follow ESLint configuration
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused
- Use Tailwind CSS utility classes for styling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Shehara Siriwardana - [Shehara-dev](https://github.com/Shehara-dev)

## 🙏 Acknowledgments

- Next.js Documentation
- Tailwind CSS Documentation
- shadcn/ui Component Library
- Spring Boot Backend Team

## 📞 Support

For support, email sheharasiriwardana21@Gmail.com or open an issue in the repository.

---

**Note**: This is a learning project developed as part of a full-stack development course. Ensure the backend API and API Gateway are running before starting the frontend application.