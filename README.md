<img alt="Logo" src="./resources/gitbanner.jpg" width="100%" />

<div align="center" width="100%">
<h3>Secure Dashboard<h3>
<h4>Comprehensive Web Authentication Application<h4>
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

### Authentication Flow

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
    MFA -->|Yes| Pre2FA["Issue Pre-MFA Token\nlimited scope"]
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
