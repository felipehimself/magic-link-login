# Nest JS API with Magic Link Authentication

This project implements a Nest JS API that allows users to authenticate using magic links. Sessions are managed via HTTP-only cookies, specifically 'magic-link-access-token' and 'magic-link-refresh-token'.

## Features

- **Authentication Strategies**: Utilizes three authentication strategies: jet, magic-login, and refresh-token.
- **Guards**: Includes two guards; one for refresh token validation and another for JWT validation.
- **Interceptor**: Implements an interceptor to manage refresh token validation. The interceptor checks the validity of the refresh token on each request and regenerates it if necessary to prolong the user's session.

## Endpoints

- **POST /api/auth/signin**: Generates a magic link and sends it via email for user authentication.
- **POST /api/auth/login/callback**: Verifies the validity of the magic link when the user attempts to log in.
- **POST /api/auth/signup**: Creates a new user with email, name, and username. Sends an email to the user to confirm their account.
- **POST /api/auth/confirm-account**: Allows the user to confirm their account with the email from the previous endpoint. If confirmed, the frontend automatically logs in the user; otherwise, a cron job deletes the user.
- **GET /api/auth/is-signed-in**: Verifies if a user is still valid.
- **POST /api/auth/signout**: Signs out the user by deleting their cookies.
- **POST /api/auth/refresh-token**: Generates a new access token if it has expired.

## Frontend

Additionally, there's a frontend application built with React + Vite that consumes the API. It includes layouts to determine if the user can access specific content and an Axios interceptor responsible for fetching a new access token if the current one has expired.
