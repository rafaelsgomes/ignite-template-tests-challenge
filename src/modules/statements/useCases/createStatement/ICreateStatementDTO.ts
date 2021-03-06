import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO =
Pick<
  Statement,
  'user_id' |
  'reciver_id' |
  'description' |
  'amount' |
  'type'
>
