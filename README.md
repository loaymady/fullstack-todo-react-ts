# Fullstack Todo List

## Overview

Fullstack Todo List is a React application with TypeScript on the frontend, featuring a todo management system. This project utilizes technologies such as Vite, React, React Router, React Query, Tailwind CSS, and more.

## Technologies Used

- React
- TypeScript
- React Router
- React Query
- Tailwind CSS
- @headlessui/react
- react-hook-form
- yup
- axios

## Demo

[Explore Todo List App](https://fullstack-todo-react-ts.vercel.app/)

## Project Structure

- `src/`: Directory containing the source code.
  - `components/`: Directory containing the application components.
    - `Navbar.tsx`: Navigation bar component.
    - `Paginator.tsx`: Paginator component.
    - `TodoList.tsx`: Todo list component.
    - `TodoSkeleton.tsx`: Skeleton component for loading todos.
    - `ui/`: Directory containing UI components.
      - `Button.tsx`: Button component with customizable styles.
      - `Input.tsx`: Input component for user data entry.
      - `Modal.tsx`: Modal component for displaying dialogs.
      - `ErrorMsg.tsx`: Component for displaying error messages.
      - `Textarea.tsx`: Textarea component.
    - `auth/`: Authentication-related components.
      - `ProtectedRoute.tsx`: Component for protecting routes.
    - `errors/`: Components related to error handling.
      - `ErrorHandler.tsx`: Component for handling errors.
  - `pages/`: React pages for different routes.
    - `index.tsx`: Main page component.
    - `Layout.tsx`: Layout component.
    - `Login.tsx`: Login page component.
    - `PageNotFound.tsx`: Component for 404 errors.
    - `Profile.tsx`: User profile page component.
    - `Register.tsx`: Registration page component.
    - `Todos.tsx`: Todos page component.
  - `router/`: React Router configuration.
    - `index.tsx`: Router configuration.
  - `validation/`: Directory containing validation functions.
    - `validation.ts`: File containing validation functions for form inputs.
  - `hooks/`: Custom hooks used in the project.
    - `useAuthenticatedQuery.ts`: Custom hook for authenticated queries.
  - `interfaces/`: Directory containing TypeScript interfaces.
    - `index.ts`: File exporting TypeScript interfaces used throughout the project.
  - `data/`: Directory containing data-related files.
    - `index.ts`: File exporting structured data used in the application.
  - `config/`: Directory containing configuration files.
    - `axios.config.ts`: Axios configuration file for handling API requests.
  - `lib/`: Directory containing utility functions and libraries.
    - `utils.ts`: Utility functions used across the project.

## Backend API

The Fullstack Todo List app communicates with a Strapi backend. The backend API is hosted at:

- **Base URL:** `https://strapi-todolist.onrender.com/api`
- **Timeout:** 8000 milliseconds

For any backend-related inquiries or issues, please refer to the Axios configuration file:

- [`config/axios.config.ts`](path/to/your/project/config/axios.config.ts)

## Backend Setup

To set up the backend for the Fullstack Todo List app, follow these steps:

1. Access the Strapi backend admin panel by visiting [https://strapi-todolist.onrender.com/admin](https://strapi-todolist.onrender.com/admin).

2. Login a super admin account.
   - Email: admin@admin.com
   - Password: Aa123456

**Note:** Due to the nature of hosting services, it's possible that the Render domain may experience sleep mode delays. If you encounter any issues accessing the backend immediately after setup, please allow some time for the domain to activate.

## Usage

### Main Page (After Login)

Upon successfully logging in, users are directed to the main page, where they can efficiently manage their todo list. Here's a breakdown of the features:

- **View and Manage Todos:** The main page provides an overview of your existing todos, allowing you to effortlessly view and manage them.

- **Post New Todo:** Utilize the "Post new todo" button to add a fresh todo to your list.

- **Edit Todos:** For each todo, click on the "Edit" button to modify its title and description.

- **Remove Todos:** Click on the "Remove" button to delete a todo. A confirmation modal will prompt you to confirm the deletion.

### Todos Page

- View your existing tasks.
- Use the paginator to navigate through different pages of your todo list.
- Change the sorting order of tasks (oldest or latest).
- Adjust the number of tasks displayed per page.
- Generate new todos with the "Generate todos" button.
