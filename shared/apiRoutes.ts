const API_ROUTES = {
  AUTH: {
    BASE: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
    },
    TWO_FACTOR_AUTH: {
        STATUS: "/auth/2fa/status",
        DATA: "/auth/2fa/data",
        VERIFY: "/auth/2fa/verify",
        AUTH: "/auth/2fa",
        DEACTIVATE: "/auth/2fa"
    },
    VALIDATE: {
        STATUS: "/auth/status",
        VERIFY: "/auth/verify"
    }
  },
  OAUTH: {
      GOOGLE: {
          AUTH: "/auth/google",
          REGISTER: "/auth/google/register",
          CALLBACK: "/auth/google/callback"
      },
      GITHUB: {
          AUTH: "/auth/github",
          CALLBACK: "/auth/github/callback"
      },
      LINKED: {
          PROVIDERS: "/oauth/providers",
          IDENTIFY: "/oauth/identify"
      }
  },
  VERIFICATION: {
    SEND_CODE: "/verify/send-code",
    CHECK_CODE: "/verify/check-code",
    CANCEL: "/verify/cancel"
  },
  SESSION: {
    GET_CURRENT: "/session",
    GET_ALL: "/sessions",
    GET_USER: "/session/user"
  },
  ACCOUNT: {
    VERIFY_PASSWORD: "/user/password/verify",
    UPDATE_PASSWORD: "/user/password/update",
    DELETE_ACCOUNT: "/user"
  }
}

export default API_ROUTES;