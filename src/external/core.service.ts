import { userSignUpDto } from '../dtos/auth.dto';
import { createUserCore, createUserResponse } from './core.dto';

export async function createUser(
  createUserRequest: userSignUpDto,
): Promise<any> {
  const createRequest = {} as createUserCore;

  createRequest.fullname = createUserRequest.name;
  createRequest.country = createUserRequest.country;
  createRequest.nationality = createUserRequest.nationality;
  createRequest.idnum = createUserRequest.idnum;
  createRequest.idtype = createUserRequest.idtype;
  createRequest.dob = createUserRequest.dob;

  console.log('Here request', createRequest);
  const res = await fetch(`${process.env.CORE_URL}/user/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createRequest),
  });

  if (!res.ok) {
    throw new Error(`Failed to create user: ${res.statusText}`);
  }

  const createRepsonse: createUserResponse = await res.json();

  return createRepsonse;
}
