# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start the development server on port 3001
npm run dev

# Build the application for production
npm run build

# Start the production server
npm run start

# Run ESLint to check for code quality issues
npm run lint
```

## Project Overview

Noveroo is an AI-powered interactive story generation platform built with Next.js. It allows users to create, play, and share educational story games with minimal input. The platform uses AI (Stability AI, previously Google Gemini) to generate branching narratives with choices, educational content, and images.

## Architecture

### Tech Stack
- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **AI Services**: 
  - Stability AI for image generation
  - Previously Google Gemini API for story generation
- **Payment**: Stripe integration

### Directory Structure

The codebase follows a feature-based organization:

- `/src/app`: Next.js App Router pages and API routes
- `/src/features`: Feature-specific components organized by domain
- `/src/utils`: Core utilities including AI generation, Firebase interaction, and service logic
- `/src/hooks`: Custom React hooks for state management and data fetching
- `/src/lib`: External service configurations
- `/src/ui`: Reusable UI components

### Key Components

1. **Story Generation**: 
   - `src/utils/gemini.ts` - Core AI story generation
   - `src/app/api/story/generate/route.ts` - API endpoint for story generation

2. **Story Player**: 
   - `src/features/story/components/StoryPlayer.tsx` - Interactive story player with animations

3. **Authentication**:
   - `src/app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
   - `src/hooks/useAuth.ts` - Authentication hook

4. **Dashboard**:
   - `src/features/dashboard/*` - User dashboard components for story management

## Core Data Models

- **Story**: Main data structure containing metadata, scenes, and references
- **Scene**: Individual story segments with text, choices, and images
- **Choice**: Decision points that link to subsequent scenes
- **LearningPoint**: Educational content embedded in scenes
- **Ticket**: Resource consumption model for story generation

## Authentication Flow

The application uses NextAuth.js with Firebase integration:
1. User logs in via NextAuth
2. Session is created and linked to Firebase
3. Auth state is shared throughout the app via contexts

## Story Generation Flow

1. User provides a theme or input
2. API validates user ticket/points
3. AI generates story content with scenes and choices
4. Optional image generation for scenes
5. Story is saved to Firestore
6. User ticket is consumed

## Environment Variables

The application requires the following environment variables:

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# Stability AI
STABILITY_API_KEY

# NextAuth
NEXTAUTH_SECRET
NEXTAUTH_URL

# Stripe (for payments)
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```