/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AuthenticatedAdmin {
  email: string;
  role: 'admin';
  authenticatedAt: number;
  sessionId: string;
}

interface StoredCredentialVault {
  email: string;
  saltHex: string;
  hashHex: string;
  createdAt: number;
  updatedAt: number;
}

const ADMIN_EMAIL = 'contactesfaye@gmail.com';
const VAULT_STORAGE_KEY = 'tt_admin_secure_vault_v1';
const SESSION_STORAGE_KEY = 'tt_admin_auth_session_v1';

// Convert ArrayBuffer to hex string
function bufToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert hex string to Uint8Array
function hexToBuf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Derive PBKDF2 hash using Web Crypto API
async function derivePbkdf2Hash(password: string, salt: Uint8Array): Promise<string> {
  const encoder = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    256
  );

  return bufToHex(derivedBits);
}

// Timing-safe comparison to prevent side-channel timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export const authService = {
  getAdminEmail(): string {
    return ADMIN_EMAIL;
  },

  // Check if administrator credential vault has been initialized
  isAccountInitialized(): boolean {
    try {
      const stored = localStorage.getItem(VAULT_STORAGE_KEY);
      if (!stored) return false;
      const vault: StoredCredentialVault = JSON.parse(stored);
      return vault.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && Boolean(vault.hashHex);
    } catch {
      return false;
    }
  },

  // Register/create administrator credentials through the auth system
  // The password is cryptographically hashed with PBKDF2 and a 16-byte random salt.
  // The raw password is NEVER stored anywhere.
  async registerAdmin(email: string, password: string): Promise<AuthenticatedAdmin> {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== ADMIN_EMAIL.toLowerCase()) {
      throw new Error(`Unauthorized email address. Only ${ADMIN_EMAIL} can be provisioned as administrator.`);
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters in length.');
    }

    // Generate random 16-byte cryptographic salt
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const saltHex = bufToHex(salt.buffer);
    const hashHex = await derivePbkdf2Hash(password, salt);

    const vault: StoredCredentialVault = {
      email: ADMIN_EMAIL,
      saltHex,
      hashHex,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));

    return this.createSession(ADMIN_EMAIL);
  },

  // Authenticate administrator with email and password
  async login(email: string, password: string): Promise<AuthenticatedAdmin> {
    // Artificial slight delay for realistic auth feedback & brute-force mitigation
    await new Promise((resolve) => setTimeout(resolve, 600));

    const normalizedEmail = email.trim().toLowerCase();

    // Verification check for administrator identity
    if (normalizedEmail !== ADMIN_EMAIL.toLowerCase()) {
      throw new Error('Invalid email or password. Access is restricted to authorized administrators.');
    }

    const stored = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!stored) {
      throw new Error('Administrator account has not been initialized yet. Please initialize your master password.');
    }

    let vault: StoredCredentialVault;
    try {
      vault = JSON.parse(stored);
    } catch {
      throw new Error('Corrupted credentials vault. Please re-initialize administrator account.');
    }

    const salt = hexToBuf(vault.saltHex);
    const candidateHash = await derivePbkdf2Hash(password, salt);

    if (!timingSafeEqual(candidateHash, vault.hashHex)) {
      throw new Error('Invalid email or password. Access is restricted to authorized administrators.');
    }

    return this.createSession(ADMIN_EMAIL);
  },

  // Create an authenticated session
  createSession(email: string): AuthenticatedAdmin {
    const session: AuthenticatedAdmin = {
      email,
      role: 'admin',
      authenticatedAt: Date.now(),
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };

    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  // Get currently active authenticated admin user session
  getCurrentUser(): AuthenticatedAdmin | null {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return null;
      const session: AuthenticatedAdmin = JSON.parse(stored);
      // Verify session integrity
      if (session.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && session.role === 'admin') {
        return session;
      }
      return null;
    } catch {
      return null;
    }
  },

  // Check if session is currently valid
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  // Log out administrator and terminate session
  logout(): void {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  },

  // Reset or change master password (requires authentication or setup)
  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('You must be logged in as an administrator to change the password.');
    }

    // Verify current password first
    await this.login(ADMIN_EMAIL, currentPassword);

    // Set new password
    await this.registerAdmin(ADMIN_EMAIL, newPassword);
  },
};
