// src/types/GoogleProfile.ts
export interface GoogleProfile {
  id: string;
  displayName: string;
  emails?: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
}
