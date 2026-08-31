const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/finora/php/api.php';

const AUTH_TOKEN_KEY = 'finora_token';
const AUTH_USER_KEY = 'finora_user';

const storage = () => window.sessionStorage;

export const getAuthToken = () => {
    try {
        return storage().getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }
};

export const hasAuthToken = () => Boolean(getAuthToken());

export const setAuthToken = (token) => {
    try {
        if (token) {
            storage().setItem(AUTH_TOKEN_KEY, token);
            localStorage.removeItem(AUTH_TOKEN_KEY);
            return;
        }

        storage().removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
        // ignore storage failures
    }
};

export const setCurrentUser = (user) => {
    try {
        if (user) {
            storage().setItem(AUTH_USER_KEY, JSON.stringify(user));
            localStorage.removeItem(AUTH_USER_KEY);
            return;
        }

        storage().removeItem(AUTH_USER_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
    } catch (error) {
        // ignore storage failures
    }
};

export const getCurrentUser = () => {
    try {
        const raw = storage().getItem(AUTH_USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
};

export const clearAuth = () => {
    try {
        storage().removeItem(AUTH_TOKEN_KEY);
        storage().removeItem(AUTH_USER_KEY);
    } catch (error) {
        // ignore storage failures
    }

    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
};

export async function apiRequest(action, options = {}) {
    const method = options.method || 'GET';
    const token = getAuthToken();
    const headers = { ...(options.headers || {}) };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }

    if (token && !options.skipAuth) {
        headers.Authorization = `Bearer ${token}`;
    }

    const url = new URL(API_BASE_URL);
    url.searchParams.set('action', action);
    if (token && !options.skipAuth) {
        url.searchParams.set('token', token);
    }

    const requestOptions = {
        method,
        headers,
    };

    if (options.body !== undefined) {
        requestOptions.body = options.body instanceof FormData ? options.body : JSON.stringify(options.body);
    }

    const response = await fetch(url.toString(), requestOptions);
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json() : { message: await response.text() };

    if (!response.ok) {
        throw new Error(payload.message || 'Request failed');
    }

    return payload;
}

export const getImageUrl = (relativePath) => {
    if (!relativePath) return null;
    // Extract base URL: http://localhost/finora/ from http://localhost/finora/php/api.php
    const baseUrlParts = API_BASE_URL.split('/php/api.php')[0];
    return `${baseUrlParts}/${relativePath}`;
};
