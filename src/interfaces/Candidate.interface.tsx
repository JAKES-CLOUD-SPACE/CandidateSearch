// TODO: Create an interface for the Candidate objects returned by the API
export interface Candidate {
  login: string;
  avatar_url: string;
  name?: string;
  location?: string | null;
  email: string;
  company?: string | null;
  bio: string;
  html_url: string;
}
  