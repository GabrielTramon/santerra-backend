import { Member } from "../entities/member";

export const MEMBER_REPOSITORY = "MemberRepository";

export interface FindMembersParams {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}

export interface FindMembersResult {
  members: Member[];
  total: number;
}

export interface MemberRepository {
  findById(
    id: string,
    companyId: string,
    includeDeleted?: boolean,
  ): Promise<Member | null>;
  findByUserId(
    userId: string,
    companyId: string,
    includeDeleted?: boolean,
  ): Promise<Member | null>;
  findMany(params: FindMembersParams): Promise<FindMembersResult>;
  update(member: Member): Promise<Member>;
  delete(member: Member): Promise<void>;
}
