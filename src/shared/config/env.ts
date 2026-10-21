export const env = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  environmentId: import.meta.env.VITE_ENVIRONMENT_ID as string,
  projectId: import.meta.env.VITE_PROJECT_ID as string,
  /** Design phase: protected pages open without login. Must be off in production. */
  designMode: import.meta.env.VITE_DESIGN_MODE === 'true',
} as const
