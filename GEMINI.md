# Project Overview

This is a personal expense management application built with React, Vite, and Tailwind CSS. It allows users to track their income, loans, and recurring payments. The application provides financial metrics and visualizations using the Recharts library to help users understand their financial situation. It also includes functionality to import and export data.

## Building and Running

To get the application running locally, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the application on `http://localhost:5173`.

3.  **Build for production:**
    ```bash
    npm run build
    ```
    This will create a `dist` directory with the production-ready files.

4.  **Lint the code:**
    ```bash
    npm run lint
    ```

## Development Conventions

*   **Framework:** The project uses React with Vite for a fast development experience.
*   **Styling:** Tailwind CSS is used for styling.
*   **Linting:** ESLint is set up to enforce code quality.
*   **Components:** The application is structured into reusable components located in the `src/components` directory.
*   **State Management:** The application's state is managed through the `useLoanData` custom hook.
*   **Utilities:** Calculation logic is separated into utility functions in the `src/utils` directory.
