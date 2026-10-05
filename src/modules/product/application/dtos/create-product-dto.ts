export interface CreateProductDto {
  name: string;
  description?: string | null;
  price?: number | null;
  costPrice?: number | null;
  manufacturerId: string;
  companyId: string;
}
