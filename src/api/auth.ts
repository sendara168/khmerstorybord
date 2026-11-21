export interface AuthUser {
  username: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
  message?: string;
}

const STORAGE_KEY_TOKEN = 'khmer_storyboard_auth_token_v1';
const STORAGE_KEY_USER = 'khmer_storyboard_auth_user_v1';
const STORAGE_KEY_CREDS = 'khmer_storyboard_local_creds_v1';

export const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'password123',
};

function getLocalCredentials(): { username: string; password: string } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_CREDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.username && parsed.password) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_CREDENTIALS;
}

function saveLocalCredentials(username: string, password: string): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY_CREDS,
      JSON.stringify({
        username: username.trim(),
        password: password.trim(),
        updatedAt: new Date().toISOString(),
      })
    );
  } catch {
    // ignore
  }
}

export function getAuthToken(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY_TOKEN);
  } catch {
    return null;
  }
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_USER);
    if (raw) {
      return JSON.parse(raw) as AuthUser;
    }
  } catch {
    // ignore
  }
  return null;
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken() && getCurrentUser());
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const cleanUser = (username || '').trim();
  const cleanPass = (password || '').trim();

  if (!cleanUser || !cleanPass) {
    return {
      success: false,
      error: 'សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ និងពាក្យសម្ងាត់!',
    };
  }

  // 1. Try server endpoint
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: cleanUser, password: cleanPass }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      window.localStorage.setItem(STORAGE_KEY_TOKEN, data.token || 'token_' + Date.now());
      window.localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user || { username: cleanUser }));
      saveLocalCredentials(cleanUser, cleanPass);
      return data;
    }
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'ឈ្មោះអ្នកប្រើប្រាស់ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ!',
      };
    }
  } catch {
    // Server is unreachable, fallback to local offline credentials
  }

  // 2. Offline / Local fallback check
  const localCreds = getLocalCredentials();
  if (
    cleanUser.toLowerCase() === localCreds.username.toLowerCase() &&
    cleanPass === localCreds.password
  ) {
    const fakeToken = 'local_' + btoa(`${cleanUser}:${Date.now()}`);
    const user: AuthUser = { username: localCreds.username };
    window.localStorage.setItem(STORAGE_KEY_TOKEN, fakeToken);
    window.localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return {
      success: true,
      token: fakeToken,
      user,
      message: 'Login ជោគជ័យ (Offline Mode)!',
    };
  }

  return {
    success: false,
    error: 'ឈ្មោះអ្នកប្រើប្រាស់ (Username) ឬពាក្យសម្ងាត់ (Password) មិនត្រឹមត្រូវទេ!',
  };
}

export async function updateCredentials(
  currentPassword: string,
  newUsername: string,
  newPassword: string
): Promise<AuthResponse> {
  const cleanUser = (newUsername || '').trim();
  const cleanPass = (newPassword || '').trim();
  const currentPass = (currentPassword || '').trim();

  if (!cleanUser || cleanUser.length < 3) {
    return {
      success: false,
      error: 'Username ថ្មីត្រូវមានយ៉ាងតិច ៣ តួអក្សរ!',
    };
  }
  if (!cleanPass || cleanPass.length < 4) {
    return {
      success: false,
      error: 'Password ថ្មីត្រូវមានយ៉ាងតិច ៤ តួអក្សរ!',
    };
  }

  // 1. Try server update
  try {
    const res = await fetch('/api/auth/update-credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken() || ''}`,
      },
      body: JSON.stringify({
        currentPassword: currentPass,
        newUsername: cleanUser,
        newPassword: cleanPass,
      }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (data.token) {
        window.localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
      }
      if (data.user) {
        window.localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
      }
      saveLocalCredentials(cleanUser, cleanPass);
      return data;
    }
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'មិនអាចកែប្រែ Username / Password បានទេ!',
      };
    }
  } catch {
    // Server is unreachable, fallback to local storage
  }

  // 2. Offline / Local fallback check
  const localCreds = getLocalCredentials();
  if (currentPass && currentPass !== localCreds.password) {
    return {
      success: false,
      error: 'ពាក្យសម្ងាត់ចាស់ (Current Password) មិនត្រឹមត្រូវទេ!',
    };
  }

  saveLocalCredentials(cleanUser, cleanPass);
  const user: AuthUser = { username: cleanUser };
  const newToken = 'local_' + btoa(`${cleanUser}:${Date.now()}`);
  window.localStorage.setItem(STORAGE_KEY_TOKEN, newToken);
  window.localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));

  return {
    success: true,
    message: 'បានកែប្រែ Username និង Password ដោយជោគជ័យ!',
    user,
    token: newToken,
  };
}

export function logout(): void {
  try {
    const token = getAuthToken();
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  } catch {
    // ignore
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY_TOKEN);
    window.localStorage.removeItem(STORAGE_KEY_USER);
  } catch {
    // ignore
  }
}
