# JOL Beauty Manager

Mobile app for JOL Beauty salon managers. Built with React Native (Expo).

## Setup

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your iPhone.

## Project Structure

```
src/
  api/client.ts          — Axios instance (prod2.maxintelli.net)
  screens/
    LoginScreen.tsx      — Email/password authentication
    TodayScreen.tsx      — Today's appointments
    ScheduleScreen.tsx   — Schedule browser by date
    DialogsScreen.tsx    — Client dialogs (placeholder)
  components/
    VisitCard.tsx        — Appointment card component
  navigation/
    AppNavigator.tsx     — Bottom tab navigation
```

## API

Base URL: `https://prod2.maxintelli.net:8443/jol/api`

- `POST /auth/login` — authenticate with email/password
- `GET /schedule?date=YYYY-MM-DD&lang=ua` — get appointments for a date
