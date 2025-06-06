# System Patterns

The application follows a standard client-side React architecture.

## Key Components

*   **`App.js`**: The main application component, responsible for layout and state management.
*   **`UUIDDisplay.js` (to be `MPIDDisplay.js`)**: The component responsible for rendering the table of data.
*   **`use-uuid-search.js` (to be `use-mpid-search.js`)**: A hook for managing search and filtering logic.
*   **`FavoritesWidget.js`**: A component for displaying and managing favorited items.

## Data Flow

1.  MPID data is stored as a constant in the application.
2.  The main `App` component passes this data to the display component.
3.  User interactions (searching, favoriting) are managed through custom hooks and state updates.
4.  Favorited items are persisted in local storage.
