export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Um erro interno não experado aconteceu.", {
      cause,
    });
    (this.name = "InternalServerError"),
      (this.action = "Entre em contato com o suporte."),
      (this.statusCode = 500);
  }

  toJson() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
