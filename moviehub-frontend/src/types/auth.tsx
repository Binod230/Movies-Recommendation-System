/* SUBEDI RABIN M25W0465 */
export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  message: string;
};
