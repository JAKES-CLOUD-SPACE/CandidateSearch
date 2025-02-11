// TODO: Create an interface for the Candidate objects returned by the API
export interface Candidate {
  login: string;  // GitHub username (key used for rejection)
  avatar_url: string;  // Avatar URL
  name?: string;  // Full name (optional)
  location?: string | null;  // Location (optional)
  email: string;  // Email (optional)
  company?: string | null;  // Company (optional)
  bio: string;  // Bio (optional)
  html_url: string;  // GitHub profile URL

}
  