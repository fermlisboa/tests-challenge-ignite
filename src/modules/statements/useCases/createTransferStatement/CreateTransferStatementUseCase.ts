import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../enums/OperationTypeEnum";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferStatementError } from "./CreateTransferStatementError";
import { ICreateTransferStatementDTO } from "./ICreateTransferStatementDTO";

@injectable()
export class CreateTransferStatementUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    amount,
    description,
    sender_id,
    recipient_id,
  }: ICreateTransferStatementDTO) {
    if (sender_id === recipient_id) {
      throw new CreateTransferStatementError.CantTransferToYourSelf();
    }

    const sender = await this.usersRepository.findById(sender_id);

    if (!sender) {
      throw new CreateTransferStatementError.UserSenderNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    if (amount > balance) {
      throw new CreateTransferStatementError.InsufficientFunds();
    }

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.TRANSFER,
      sender_id,
      user_id: recipient_id,
    });
  }
}
