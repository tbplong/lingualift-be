export class CreateUserDto {
  public readonly email: string;

  public readonly isManager: boolean;

  public readonly firstName: string | null;

  public readonly lastName: string | null;

  public readonly picture: string | null;

  public readonly googleId: string | null;

  public readonly appleId: string | null;

  public readonly dateOfBirth: string | null;

  public readonly phone: string | null;

  public password: string | null;

  public slug: string;
}
