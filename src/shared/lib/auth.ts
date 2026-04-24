const KEY = 'idap-admin-auth';

export function isAuthed(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(KEY) === '1';
}

export function signIn(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, '1');
}

export function signOut(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}
