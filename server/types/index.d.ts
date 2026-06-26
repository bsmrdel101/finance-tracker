import "express-serve-static-core";


declare module "express-serve-static-core" {
  interface Request {
    user: User
    isAuthenticated(): boolean
    isUnauthenticated(): boolean
    ebayAccessToken?: string;
  }

  interface Response {
    customData?: any
  }
}
