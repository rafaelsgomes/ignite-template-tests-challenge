import { Statement } from "../../entities/Statement";

export type ICreateTransferDTO =
Pick<
  Statement,
  'user_id' |
  'description' |
  'amount' |
  'reciver_id'
>
