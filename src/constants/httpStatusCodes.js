export const HTTP_STATUS = {
  // ✅ Success Status Codes
  OK: 200, // Request successful
  CREATED: 201, // Resource created successfully
  ACCEPTED: 202, // Request accepted, but processing asynchronously
  NO_CONTENT: 204, // Request successful, but no response body

  // ❌ Client Error Status Codes
  BAD_REQUEST: 400, // Invalid request (missing/incorrect data)
  UNAUTHORIZED: 401, // Authentication required or failed
  FORBIDDEN: 403, // Authenticated, but no permission
  NOT_FOUND: 404, // Resource not found
  METHOD_NOT_ALLOWED: 405, // HTTP method not supported
  CONFLICT: 409, // Resource conflict (e.g., duplicate entry)
  UNPROCESSABLE_ENTITY: 422, // Validation errors in request data
  TOO_MANY_REQUESTS: 429, // Rate limiting exceeded

  // 🛑 Server Error Status Codes
  INTERNAL_SERVER_ERROR: 500, // General server error
  NOT_IMPLEMENTED: 501, // Endpoint not implemented
  BAD_GATEWAY: 502, // Invalid response from an upstream service
  SERVICE_UNAVAILABLE: 503, // Server is overloaded or under maintenance
  GATEWAY_TIMEOUT: 504, // Timeout from an upstream service
};
