export interface CreateUserDto {
  email: string;
  personId: string;
  password: string;
  active?: boolean;
}
