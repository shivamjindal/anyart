# Testing Guide

This project includes comprehensive unit tests for all major components and functionality.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Test Coverage

The test suite covers:

### API Functions (`__tests__/lib/api.test.ts`)
- Fetching artworks from the API
- Searching artworks with queries
- Generating image URLs
- Error handling for failed requests

### Components
- **ArtworkCard** (`__tests__/components/artwork-card.test.tsx`)
  - Rendering artwork details
  - Handling missing images
  - Displaying placeholder text
  
- **ArtworkGrid** (`__tests__/components/artwork-grid.test.tsx`)
  - Rendering multiple artworks
  - Loading states with skeletons
  - Empty state handling

- **Pagination** (`__tests__/components/pagination.test.tsx`)
  - Navigation controls
  - Page number display
  - Disabled states
  - Page selection

- **SearchBar** (`__tests__/components/search-bar.test.tsx`)
  - Input handling
  - Debouncing functionality
  - Clear button behavior

### Pages
- **Home Page** (`__tests__/app/page.test.tsx`)
  - Initial data fetching
  - Search integration
  - Pagination functionality
  - Loading and error states

## Test Configuration

Tests are configured using:
- **Jest**: Test runner
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Additional matchers

Configuration files:
- `jest.config.js`: Jest configuration
- `jest.setup.js`: Test environment setup

