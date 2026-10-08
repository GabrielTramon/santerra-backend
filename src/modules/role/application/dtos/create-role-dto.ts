export interface CreateRoleDto {
  name: string;
  description?: string | null;
  companyId: string;
}
