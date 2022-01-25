import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}


@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, amount, description, reciver_id }: ICreateTransferDTO) {
    const sender = await this.usersRepository.findById(user_id);
    const reciver = await this.usersRepository.findById(reciver_id as string);

    if(!reciver || !sender) {
      throw new CreateTransferError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds()
    }

    await this.statementsRepository.create({
      user_id,
      reciver_id,
      type: OperationType.TRANSFER,
      amount,
      description
    });

    const transferOperation = await this.statementsRepository.create({
      user_id: reciver_id as string,
      reciver_id,
      type: OperationType.TRANSFER,
      amount,
      description
    });

    return transferOperation;
  }
}
