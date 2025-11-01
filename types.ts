export enum PetStatus {
  Lost = 'Lost',
  Found = 'Found',
}

export enum AppView {
  Home = 'HOME',
  Form = 'FORM',
  Dashboard = 'DASHBOARD',
}

export interface Pet {
  id?: string;
  userId?: string;
  name: string;
  status: PetStatus;
  species: string;
  breed: string;
  color: string;
  age: string;
  gender: string;
  isMicrochipped: boolean;
  date: string;
  location: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  photo: string | null;
  coordinates?: { lat: number; lng: number };
  createdAt?: any;
}