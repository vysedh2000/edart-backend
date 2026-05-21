import { IsEmail, IsString } from 'class-validator';

export class userLoginDto {
  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

  password!: string;
  remember!: string;
}

export class userSignUpDto {
  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  password!: string;
  nationality!: string;
  country!: string;
  dob!: string;
  idnum!: string;
  idtype!: string;
}

export class userSignUpReponseDto {
  status!: string;
  session!: string;
}

export class userSession {
  auth_id!: string;
  user_id!: string;
  token!: string;
}
