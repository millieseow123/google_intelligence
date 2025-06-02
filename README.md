This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Google Intelligence Product Requirement Document

## Introduction

This document outlines the requirements for the development of an application named Google Intelligence, which aims to provide a seamless integration with Google Calendar, Gmail, and Google Meet. The application should be open to extension in the future to expand to include other google service and features.

### Scope

The core focus of this application is on task management, priority assignment, delegation, and real-time interaction with Google Calendar, Gmail, and Google Meet. The application will be primarily web-based, utilizing voice commands for added interactivity and accessibility.

## Features

1. **Task Management**

   - Users can create tasks or to-dos using voice commands or text inputs.
   - The created tasks will be saved in Google Calendar as events with appropriate details.

2. **Priority Assignment**

   - Tasks can have a priority level to indicate their importance.
   - Users can assign a priority level to each task when creating them.

3. **Delegation**

   - Users can delegate tasks or to-dos to other individuals if needed.
   - Delegated tasks will be synced with the delegator's Google Calendar and sent via email as reminders.

4. **Integration with Google Calendar**

   - All created tasks (including delegated ones) will be synced and scheduled in Google Calendar.
   - Users can view their tasks within Google Calendar for easy accessibility.

5. **Integration with Gmail**

   - The application should have the ability to read emails or generate a summary of the email with key actionables.
   - Based on the content of the email, relevant tasks will be created and allocated accordingly.

6. **Integration with Google Meet**

   - The intelligence system should be able to listen into Google Meet conversations in real-time.
   - During the meeting, tasks can be created and allocated based on the content of the conversation.
   - After obtaining user's permission at the end of the meeting, any relevant tasks not created during the meeting will also be generated as part of a summary of the meeting.

7. **User Interaction**
   - Implement voice commands for added interactivity and accessibility using the Google Assistant SDK.
   - Users can communicate with Google Intelligence using voice or speech, to create tasks, assign priorities, delegate tasks, and more.

## User Interface (UI) Requirements

1. Responsive design: The application should have a clean, modern design that works well across various devices (mobile, desktop).
2. Accessibility: Ensure the application is accessible to users with disabilities.
3. Customization options: Allow users to customize their preferences and settings according to their needs.
4. Scalability: The application should be able to handle increasing user load and data volume without compromising performance or stability.
5. Integration with Google Assistant: Enable voice commands for seamless interaction between the user and the assistant.

## Security Requirements

1. Single sign-on (SSO) authentication: Implement a secure login system using SSO methods, such as Google Sign-In or OAuth2.0. This will minimize the need for users to create and remember additional credentials.
2. Compliance with Google's API usage policies: Ensure that the application follows all relevant guidelines and best practices when interacting with Google APIs.
3. Access controls: Implement access control mechanisms to ensure that only authorized users can view, edit, or delete tasks and other application data.

## Frontend Requirements

1. **Frontend Framework** (Next.js)
   - Use Next.js for building a responsive, accessible user interface for the Google Smart Assistant application.
   - Implement voice recognition and text-to-speech functionality using third-party libraries such as `react-speech-recognition` or `@google-cloud/speech`.
2. **Frontend Styling** (Mui)
   - Style the user interface using MUI for a consistent, modern design and improved development speed.
3. **State Management** (Apollo Client)
   - Implement Apollo Client for managing application state and making requests to the GraphQL backend.
4. Incorporate partial rich text input functionality in the UI for user convenience. Allow users to @mention employee names or email accordingly
5. Display HTML or markdown syntax where appropriate within the user interface, such as task descriptions or email summaries.
6. Ensure proper documentation is maintained throughout the development process.

## Backend Requirements

1. **Backend Framework** (FastAPI with GraphQL)
   - Develop a GraphQL backend using FastAPI to handle requests from the Apollo Server frontend, as well as interactions with Google APIs (Google Calendar API, Gmail API, Meet API).
   - Test the backend thoroughly to ensure it works correctly across various use cases and device configurations.
2. **Database** (PostgreSQL for user information and settings)
   - Implement a PostgreSQL database for storing user information, settings, and other application data that doesn't require the storage of conversation histories.
3. Implement caching strategies at both server and client levels to improve performance.
4. Ensure secure authentication and authorization by implementing necessary access controls and using OAuth2.0 for external API calls.
5. Maintain a well-documented backend codebase to facilitate future maintenance and enhancements.
