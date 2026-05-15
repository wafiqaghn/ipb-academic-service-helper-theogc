export function decodeJwt<T extends Record<string, unknown>>(token: string): T {
  const [, payload] = token.split(".");
  if (!payload) throw new Error("Token tidak valid");
  const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(json) as T;
}
