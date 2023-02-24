import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransferStatementError {
  export class UserSenderNotFound extends AppError {
    constructor() {
      super("User sender not found", 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super("Insufficient funds", 401);
    }
  }

  export class CantTransferToYourSelf extends AppError {
    constructor() {
      super("You can't to transfer to your self!");
    }
  }
}
