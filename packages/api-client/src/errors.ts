/** Backend error envelope: { error, code, request_id?, details? }. */
export interface ApiErrorBody {
  error: string;
  code: string;
  request_id?: string;
  details?: unknown;
}

/** Thrown by the API client. Branch on `code`, surface `requestId` in bug reports. */
export class ApiError extends Error {
  status: number;
  code: string;
  requestId?: string;
  details?: unknown;

  constructor(status: number, body: Partial<ApiErrorBody>) {
    super(body.error || `Request failed (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code || "unknown";
    this.requestId = body.request_id;
    this.details = body.details;
  }
}
