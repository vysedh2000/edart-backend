import { userSignUpDto } from '../../dtos/auth.dto';
import {
  createUserCore,
  createUserResponse,
  FundTxnRequest,
  FundTxnResponse,
} from './core.dto';

const getBaseUrl = (): string => {
  const rawUrl =
    process.env.CORE_URL ??
    'http://edart-core-service.default.svc.cluster.local:8090/core';
  return rawUrl;
};

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

  const res = await fetch(`${getBaseUrl()}/user/create`, {
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

export async function getAssetsByUserId(userId: string): Promise<any> {
  const res = await fetch(`${getBaseUrl()}/accSummary/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const response = await res.json();

  if (!res.ok) {
    throw new Error(`Failed to get assets: ${response.message}`);
  }

  return response;
}

export async function FundTxnService(request: FundTxnRequest): Promise<any> {
  console.log('FundTxnService', request);
  const res = await fetch(`${getBaseUrl()}/txn/fundTxn`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error(`Failed to request fund transfer: ${res.statusText}`);
  }

  const response: FundTxnResponse = await res.json();
  return response;
}
