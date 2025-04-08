class ApiError extends Error {
  constructor(
    public success: boolean,
    public statusCode: number,
    public message: string,
    public errors?: any[],
    public stack?: string
  ) {
    super(message);
    if (!stack) Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
