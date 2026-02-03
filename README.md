<img alt="Logo" src="./resources/gitbanner.jpg" width="100%" />

<div align="center" width="100%">
<h3>Secure Dashboard</h3>
<h4>Comprehensive Web Authentication Application</h4>
</div>

### Summary

A full-stack TypeScript monorepo implementing a comprehensive web authentication and account management system.

The server is an Express API backed by PostgreSQL via Prisma, with Redis for caching and BullMQ for background job processing. It implements a layered security architecture including JWT-based authorization with refresh token rotation, OAuth 2.0 (Google, GitHub), TOTP multi-factor authentication, OTP email verification using a verification code/token system with encrypted payloads, CSRF protection via stateless double-submit, session activity tracking and blocking, and rate limiting.

The client is a responsive React frontend built with Vite and Tailwind CSS, featuring i18n localization, and the shared workspace contains cross-cutting types, validation schemas, and security utilities used by both client and server. The project also includes account management, password recovery, and captcha protection, with errors handled in accordance with [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html).

### Key Features

- Email and password registration and login
- Oauth authentication using Google and Github
- Totp multi-factor authentication
- Session block system
- Session activity management
- Verification code and token system
- Csrf double-submit protection
- Redis cache
- Account management
- Set/Update password
- Localization

### Techstack

- TypeScript
- React
- NodeJs
- Express
- Tailwind
- PostgresSQL
- Redis
- Prisma
- BullMq
- ...

### Run Locally

This project can be run locally. Below are the steps that are required to run this project on the local machine.

1. Clone repository
2. Create and configure `.env` files in both Client and Server following `.env.example` as guidelines
3. Build the shared project using `yarn build`
4. Install and run Redis in Docker
   <span style="color: gray;">For more information, visit: https://hub.docker.com/_/redis</span>
5. Run both Client and Server projects using `yarn dev`
6. Go to client origin `http://www.127.0.0.1.sslip.io:5173`

### Functionality Flow Graphs

#### Authentication

```mermaid
flowchart TD
    Client(["Client"])

    Client -->|"POST /login"| MW
    Client -->|"POST /register"| MW

    subgraph MW["Middleware"]
        CSRF["CSRF Validation"] --> Body["Body Validation"] --> Captcha["Captcha Verification"]
    end

    Captcha -->|Login| Login["Credential Verification"]
    Captcha -->|Register| Register["User Creation"]

    Login -->|"Invalid"| Err["Error Response"]
    Register -->|"Email exists"| Err

    Login -->|"Valid"| RevCheck{"Existing session?"}
    RevCheck -->|Yes| Revoke["Revoke Old Session Family"]
    RevCheck -->|No| MFA
    Revoke --> MFA

    MFA{"MFA Enabled?"}
    MFA -->|Yes| Pre2FA["Issue Pre-MFA Token, limited scope"]
    MFA -->|No| Session

    Register -->|"Created"| Session

    subgraph Session["Session Establishment"]
        direction TB
        Family["Generate Session Family ID"] --> RT["Issue Refresh Token"]
        RT --> Sess["Create Session Record"]
        Sess --> AT["Issue Access Token JWT"]
    end

    Pre2FA --> Cookies
    Session --> Cookies

    subgraph Cookies["Set Response"]
        SC["Set Auth Cookies"] --> CSRF2["Set CSRF Cookie"]
    end

    Cookies --> Success["Authenticated"]
```

#### MFA Authentication (e.g. TOTP)

```mermaid
flowchart TD
    Client3(["Client with Pre-MFA Token"])
    Client3 -->|"POST /totp/login"| Middleware["Validate Scope"]
    Middleware -->Login["Decrypt Secret<br>& Verify Code"]
    Login -->|Invalid| ErrCode2["Invalid Code"]
    Login -->|Valid| Session["Clear Pre-MFA Token<br>Create Full Session"]
    Session --> Done2["Fully Authenticated"]
```

#### MFA Setup (e.g. TOTP)

```mermaid
flowchart TD
    Client(["Authenticated Client"])

    Client -->|"POST /totp/initialize"| Init["Check Enrollment Status"]

    Init -->|"Configured"| ErrAlready["Already Configured"]
    Init -->|"Expired / Invalid"| Delete["Delete Stale Enrollment"]
    Delete --> Create
    Init -->|"Null"| Create["Create Enrollment<br>(15 min expiry)"]
    Init -->|"Awaiting Verification"| Creds["Get or Generate Secret"]

    Create --> Creds
    Creds --> Encrypt["Encrypt Secret<br>(AES-256-GCM)"]
    Encrypt --> QR["Generate QR Code<br>+ Setup Key"]
    QR --> Client2(["Client receives<br>QR Code & Key"])

    Client2 -->|"POST /totp/confirm"| Confirm["Decrypt Secret<br>& Verify Code"]
    Confirm -->|Invalid| ErrCode["Invalid Code"]
    Confirm -->|Valid| Configured["Mark Enrollment<br>as Configured"]
    Configured --> Done1["TOTP Setup Complete"]
```
