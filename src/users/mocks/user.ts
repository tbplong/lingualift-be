import { Types } from 'mongoose';

import { User, SocialMedia } from '../schema/user.schema';

export class MockUserBuilder {
  private user: Partial<User> & { _id: Types.ObjectId };

  constructor() {
    this.user = {
      _id: new Types.ObjectId(),
      email: 'johndoe@gmail.com',
      googleId: '1234567890',
      firstName: 'John',
      lastName: 'Doe',
      picture: 'https://www.example.com/avatar.jpg',
      dateOfBirth: '1990-01-01',
      phone: '+84901234567',
      isManager: false,
      isBanned: false,
      password: '$2b$10$hashedPasswordExample123456789',
    };
  }

  public withEmail(email: string): MockUserBuilder {
    this.user.email = email;
    return this;
  }

  public withGoogleId(googleId: string): MockUserBuilder {
    this.user.googleId = googleId;
    return this;
  }

  public withFirstName(firstName: string): MockUserBuilder {
    this.user.firstName = firstName;
    return this;
  }

  public withLastName(lastName: string): MockUserBuilder {
    this.user.lastName = lastName;
    return this;
  }

  public withPicture(picture: string): MockUserBuilder {
    this.user.picture = picture;
    return this;
  }

  public withDateOfBirth(dateOfBirth: string): MockUserBuilder {
    this.user.dateOfBirth = dateOfBirth;
    return this;
  }

  public withPhone(phone: string): MockUserBuilder {
    this.user.phone = phone;
    return this;
  }

  public withManager(isManager: boolean): MockUserBuilder {
    this.user.isManager = isManager;
    return this;
  }

  public withBanned(isBanned: boolean): MockUserBuilder {
    this.user.isBanned = isBanned;
    return this;
  }

  public withPassword(password: string): MockUserBuilder {
    this.user.password = password;
    return this;
  }

  public withSocialMedia(socialMedia: SocialMedia): MockUserBuilder {
    this.user.socialMedia = socialMedia;
    return this;
  }

  public withHighSchool(highSchool: string): MockUserBuilder {
    this.user.highSchool = highSchool;
    return this;
  }

  public withAddress(address: string): MockUserBuilder {
    this.user.address = address;
    return this;
  }

  public build(): Partial<User> & { _id: Types.ObjectId } {
    return this.user;
  }
}
