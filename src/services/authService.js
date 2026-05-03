import { apiRequest } from './api';

export function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function requestPasswordResetOtp(email) {
  return apiRequest('/auth/password/forgot', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function verifyPasswordResetOtp(payload) {
  return apiRequest('/auth/password/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function resetPasswordWithOtp(payload) {
  return apiRequest('/auth/password/reset', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
