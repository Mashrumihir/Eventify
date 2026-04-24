function getDefaultApiBaseUrl() {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000/api';
  }

  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:5000/api`;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || getDefaultApiBaseUrl();

function getFallbackApiBaseUrl(baseUrl) {
  if (baseUrl.includes('localhost')) {
    return baseUrl.replace('localhost', '127.0.0.1');
  }

  if (baseUrl.includes('127.0.0.1')) {
    return baseUrl.replace('127.0.0.1', 'localhost');
  }

  return null;
}

export async function apiRequest(path, options = {}) {
  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  };

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, requestOptions);
  } catch {
    const fallbackBaseUrl = getFallbackApiBaseUrl(API_BASE_URL);

    if (!fallbackBaseUrl) {
      throw new Error('Failed to connect to the server. Please check that the backend is running.');
    }

    try {
      response = await fetch(`${fallbackBaseUrl}${path}`, requestOptions);
    } catch {
      throw new Error('Failed to connect to the server. Please check that the backend is running.');
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}
