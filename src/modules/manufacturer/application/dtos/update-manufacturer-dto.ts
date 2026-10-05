export interface UpdateManufacturerDto {
  name?: string;
  registrationNumber?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  passwordHash?: string | null;
  updatedById?: string | null;
}
