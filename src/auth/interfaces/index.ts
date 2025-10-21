import { TokenPayload } from 'google-auth-library';
import { Types } from 'mongoose';

export interface GoogleLoginToken {
  accessToken: string;
  hasPassword: boolean;
  isFirstLogin: boolean;
}

export interface AuthResponseInterface {
  accessToken: string;
  hasPassword: boolean;
}

export interface GoogleProfileForNewAccountCreation {
  googleId: string;
  email?: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
}

export interface AccessTokenContent {
  tokenId: Types.ObjectId;
}

export interface GoogleAuthenticateContent {
  idToken: string;
}

export interface CustomTokenPayload extends TokenPayload {
  email: string;
}

export interface CreateTokenResponseInterface {
  tokenId: Types.ObjectId;
}

export interface AuthenticateRequestInfoInterface {
  email: string;
  password: string;
}

export interface TokenInfoInterface {
  userId: Types.ObjectId;
}
