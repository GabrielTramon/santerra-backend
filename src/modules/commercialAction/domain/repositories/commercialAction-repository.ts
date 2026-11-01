import { CommercialAction } from "../entities/commercialAction";

export const COMMERCIAL_ACTION_REPOSITORY = "CommercialActionRepository";

export interface FindCommercialActionsParams {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}

export interface FindCommercialActionsResult {
  commercialActions: CommercialAction[];
  total: number;
}

export interface CommercialActionRepository {
  create(commercialAction: CommercialAction): Promise<CommercialAction>;
  findById(
    id: string,
    companyId: string,
    includeDeleted?: boolean,
  ): Promise<CommercialAction | null>;
  findMany(params: FindCommercialActionsParams): Promise<FindCommercialActionsResult>;
  update(commercialAction: CommercialAction): Promise<CommercialAction>;
  delete(commercialAction: CommercialAction): Promise<void>;
}
