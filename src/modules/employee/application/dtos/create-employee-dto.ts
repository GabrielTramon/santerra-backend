export interface CreateEmployeeDto {
  personId: string;
  hiredAt?: Date | null;
  terminatedAt?: Date | null;
}
