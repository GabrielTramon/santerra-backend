import { Member } from "../../../member";
import { User } from "../../../user";
import { Invitation } from "../entities/invitation";

export const INVITATION_REPOSITORY = "InvitationRepository";

export interface FindInvitationsParams {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}

export interface FindInvitationsResult {
  invitations: Invitation[];
  total: number;
}

export interface AcceptInvitationParams {
  invitation: Invitation;
  member: Member;
  newUser: User | null;
}

export interface InvitationRepository {
  create(invitation: Invitation): Promise<Invitation>;
  findById(
    id: string,
    companyId: string,
    includeDeleted?: boolean,
  ): Promise<Invitation | null>;
  findByTokenHash(tokenHash: string): Promise<Invitation | null>;
  findPendingByEmail(email: string, companyId: string): Promise<Invitation | null>;
  findMany(params: FindInvitationsParams): Promise<FindInvitationsResult>;
  delete(invitation: Invitation): Promise<void>;
  accept(params: AcceptInvitationParams): Promise<void>;
}
