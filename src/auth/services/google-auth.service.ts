import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as config from '@nestjs/config';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { authConfig, AuthConfigType } from 'src/common/config';
import { GoogleLoginResponseDto } from '../dtos';
import {
  CustomTokenPayload,
  GoogleAuthenticateContent,
  GoogleLoginToken,
  GoogleProfileForNewAccountCreation,
} from '../interfaces';
import { UserDocument } from '../../users/schema';
import { UsersService } from '../../users/services';
import { TokenService } from './token.service';
import { Lock } from '../../lock';

/**
 * Handles authentication of users logging in with their Google accounts.
 * Internally, this class implements the Google Sign-In flow for server-side apps
 * (see https://developers.google.com/identity/sign-in/web/server-side-flow)
 */
@Injectable()
export class GoogleAuthService {
  private readonly lock: Lock<string> = new Lock<string>();
  constructor(
    private googleOauth2Client: OAuth2Client,
    private tokenService: TokenService,
    private userService: UsersService,
    @Inject(authConfig.KEY)
    private appAuthConfig: config.ConfigType<AuthConfigType>,
  ) {}

  /**
   * Generates a login token for a user logging in with Google account,
   * using id_token obtained when using the Google Sign-In flow for server-side apps.
   * A login token includes an access token, a boolean indicating whether the user has a password,
   * and a boolean indicating whether the user is logging in for the first time.
   *
   * @param idToken The ID token obtained from the Google Sign-In flow
   * (see https://developers.google.com/identity/sign-in/web/server-side-flow)
   */
  public async generateLoginTokenFromIdToken(
    googleAuthenticateContent: GoogleAuthenticateContent,
  ): Promise<GoogleLoginToken> {
    const { idToken } = googleAuthenticateContent;

    const loginTicket = await this.getLoginTicketFromIdToken(idToken);

    const tokenPayload = this.verifyLoginTicket(loginTicket);

    const {
      email,
      given_name: givenName,
      family_name: familyName,
      picture,
      sub: googleId,
    } = tokenPayload;

    const userWithMatchingEmail = await this.userService.findOne(email);

    const isNewUser = !userWithMatchingEmail;

    if (isNewUser) {
      // Create a new user if the user does not exist in the database
      return this.generateLoginTokenForNewAccount({
        email,
        givenName,
        familyName,
        picture,
        googleId,
      });
    }

    return this.generateLoginTokenForExistingAccount(userWithMatchingEmail);
  }

  /**
   * Checks if the login ticket is valid and extracts the payload from it.
   *
   * @param loginTicket Login ticket obtained after exchanging ID token with Google authorization server
   * @returns The payload of the login ticket if it is valid. Otherwise, throws an UnauthorizedException.
   * The payload contains personal info of the authenticating user.
   */
  private verifyLoginTicket(loginTicket: LoginTicket): CustomTokenPayload {
    const googleId = loginTicket.getUserId();

    if (!googleId) {
      throw new UnauthorizedException('Google ID không hợp lệ');
    }

    const { exp, email } = loginTicket.getPayload() || {};

    if (!exp || exp < Date.now() / 1000) {
      throw new UnauthorizedException('Mã đăng nhập không hợp lệ');
    }

    if (!email) {
      throw new UnauthorizedException('Không tìm thấy email của mã đăng nhập');
    }

    return <CustomTokenPayload>loginTicket.getPayload();
  }

  /**
   * Exchanges the ID token with Google authorization server to obtain a login ticket.
   *
   * @param idToken ID token obtained from Google Sign-In fl??
   * @returns Login ticket of Google Sign-In flow.
   */
  private async getLoginTicketFromIdToken(
    idToken: string,
  ): Promise<LoginTicket> {
    return this.googleOauth2Client.verifyIdToken({
      idToken,
      audience: this.appAuthConfig.googleClientId,
    });
  }

  /**
   * Generates a login token, which is the result of a new user
   * performing authentication for the first time with their Google account.
   *
   * @param param0 Personal info of the authenticating user,
   * which includes email, given name, family name, picture, and Google ID.
   * @returns The specified login token
   */
  private async generateLoginTokenForNewAccount({
    email,
    givenName,
    familyName,
    picture,
    googleId,
  }: GoogleProfileForNewAccountCreation): Promise<GoogleLoginResponseDto> {
    const newUser = await this.userService.create({
      firstName: givenName ?? null,
      lastName: familyName ?? null,
      picture: picture ?? null,
      email: email ?? '',
      googleId,
      dateOfBirth: null,
      phone: null,
      isManager: false,
      password: null,
    });

    const tokenInfo = { userId: newUser._id };
    const { tokenId } = await this.tokenService.create(tokenInfo);

    return {
      accessToken: this.tokenService.generateAccessToken(tokenId),
      hasPassword: false,
      isFirstLogin: true,
    };
  }

  /**
   * Generates a login token, which is the result of an existing user
   * performing the authentication with Google account.
   *
   * @param existingUser The existing user who is performing the authentication
   * @returns The specified login token
   */
  private async generateLoginTokenForExistingAccount(
    existingUser: UserDocument,
  ): Promise<GoogleLoginToken> {
    const tokenInfo = { userId: existingUser._id };
    await this.lock.acquire(`${existingUser.email}`);
    try {
      const { tokenId } = await this.tokenService.create(tokenInfo);
      const hasPassword = !!existingUser.password;

      return {
        accessToken: this.tokenService.generateAccessToken(tokenId),
        hasPassword,
        isFirstLogin: false,
      };
    } finally {
      this.lock.release(`${existingUser.email}`);
    }
  }
}
