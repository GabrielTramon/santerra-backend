import { ValidationError } from "../errors/app-error";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function ensureUuid(value: string, fieldName = "id"): void {
  if (!UUID_PATTERN.test(value)) {
    throw new ValidationError(`O campo '${fieldName}' deve ser um UUID válido.`);
  }
}

export function ensureOptionalUuid(
  value: string | null | undefined,
  fieldName: string,
): void {
  if (value !== null && value !== undefined) {
    ensureUuid(value, fieldName);
  }
}
