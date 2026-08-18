"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getAssetsByUserId = getAssetsByUserId;
exports.FundTxnService = FundTxnService;
const getBaseUrl = () => {
    const rawUrl = process.env.CORE_URL ??
        'http://edart-core-service.default.svc.cluster.local:8090/core';
    return rawUrl;
};
async function createUser(createUserRequest) {
    const createRequest = {};
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
    const createRepsonse = await res.json();
    return createRepsonse;
}
async function getAssetsByUserId(userId) {
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
async function FundTxnService(request) {
    const res = await fetch(`${getBaseUrl()}/fund-txn`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    if (!res.ok) {
        throw new Error(`Failed to request fund transfer: ${res.statusText}`);
    }
    const response = await res.json();
    return response;
}
