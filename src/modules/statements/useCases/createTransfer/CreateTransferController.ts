import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransferUseCase } from './CreateTransferUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id } = request.user;
    const {reciver_id} = request.params
    const { amount, description } = request.body;

    const createTransfer = container.resolve(CreateTransferUseCase);

    const transfer = await createTransfer.execute({
      user_id: id,
      amount,
      description,
      reciver_id,
    });

    return response.status(201).json(transfer);
  }
}
