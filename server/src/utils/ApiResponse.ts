class ApiResponse {
  constructor(
    public success: boolean,
    public statusCode: number,
    public message: string,
    public data: Object = [],
    public errors?: Object
  ) {
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
