# Personal Finance Tracker

A cross-platform mobile application built with React Native and Expo that helps users track their daily expenses, set budgets, and visualize their spending habits.

## Features

- User authentication
- Create, view, and delete expenses
- Categorize expenses
- View expense details
- Clean and modern UI
- Cross-platform (iOS and Android)

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Studio (for Android development)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
cd mobile-finance-tracker
npm install
```

## Running the App

1. Start the development server:
```bash
npm start
```

2. Use the Expo Go app on your mobile device to scan the QR code, or press:
- `a` to open Android emulator
- `i` to open iOS simulator (Mac only)
- `w` to open in web browser

## API Endpoints

The app uses a MockAPI with the base URL: `https://67ac71475853dfff53dab929.mockapi.io/api/v1`

Available endpoints:
- `GET /users?username={username}` - User authentication
- `GET /expenses` - Get all expenses
- `GET /expenses/{id}` - Get a specific expense
- `POST /expenses` - Create a new expense
- `PUT /expenses/{id}` - Update an expense
- `DELETE /expenses/{id}` - Delete an expense

## Tech Stack

- React Native
- Expo
- React Navigation
- React Native Elements
- Axios
- AsyncStorage

## Project Structure

```
mobile-finance-tracker/
├── app/
│   ├── (auth)/
│   │   └── login.tsx
│   ├── (tabs)/
│   │   ├── expenses.tsx
│   │   └── new-expense.tsx
│   ├── expense/
│   │   └── [id].tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   └── api.ts
│   └── types/
│       └── index.ts
├── assets/
└── package.json
```

## Development

The app follows the Expo Router file-based routing system and uses TypeScript for type safety. The project is structured to be scalable and maintainable. 
