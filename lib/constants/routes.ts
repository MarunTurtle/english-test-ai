// Route paths constants

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  
  // Protected routes (app)
  DASHBOARD: '/dashboard',
  PASSAGE_NEW: '/passage/new',
  PASSAGE_DETAIL: (id: string) => `/passage/${id}`,
  BANK: '/bank',
  
  // Auth
  AUTH_CALLBACK: '/auth/callback',
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.AUTH_CALLBACK,
];

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  '/passage',
  ROUTES.BANK,
];
