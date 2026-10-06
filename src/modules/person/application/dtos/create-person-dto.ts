export interface CreatePersonDto {
  name: string;
  nationalId?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
}
