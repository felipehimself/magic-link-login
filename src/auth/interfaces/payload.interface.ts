export interface IPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
