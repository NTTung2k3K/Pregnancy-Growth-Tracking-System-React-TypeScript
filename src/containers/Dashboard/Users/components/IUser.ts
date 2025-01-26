import { Child } from "../../Children/components/IChild";

export interface User {
  id: string; // Unique identifier
  email: string; // Email address
  fullName: string | null; // User's full name, nullable
  image: string | null; // User's profile image, nullable
  dateOfBirth: string | null; // Date of birth, nullable
  address: string | null; // Address, nullable
  gender: string | null; // Gender, nullable with specified options
  bloodGroup: string | null; // Blood group, nullable
  status: number | null; // Status, can be Active, Inactive, or null
  createdBy: string | null; // Creator's ID or name, nullable
  isEmailConfirmed: boolean | null; // Email confirmation status, nullable
  lastUpdatedBy: string | null; // ID or name of the last person who updated, nullable
  childs: Child[]; // List of child users (nested users)
}
