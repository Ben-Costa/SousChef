export class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = "NotFoundError";
      this.statusCode = 404;
    }
  }
  
export class DatabaseError extends Error {
    constructor(message) {
      super(message);
      this.name = "DatabaseError";
      this.statusCode = 500;
    }
  }

export class ObjectAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 500;
  }
}