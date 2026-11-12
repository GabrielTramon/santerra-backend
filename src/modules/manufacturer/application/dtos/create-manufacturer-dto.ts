export interface CreateManufacturerDto {
  name: string;
  registrationNumber?: string | null;
  phoneNumber?: string | null; 
  email?: string | null;
  passwordHash?: string | null;
}
