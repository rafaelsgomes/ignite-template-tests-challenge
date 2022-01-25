import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO'
import { GetStatementOperationError } from "./GetStatementOperationError";

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer'
  }
  

describe('Get statement', ()=>{
    beforeEach(()=>{
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    })
    it("Should be able to get a user statement", async ()=>{
        const user = await inMemoryUsersRepository.create({
            name: 'Test', 
            email: 'test@jest.test.com', 
            password:  'test' 
        })

        const statement: ICreateStatementDTO = {
            user_id: user.id as string, 
            type: OperationType.DEPOSIT, 
            amount: 1500, 
            description: 'test'

        }
        const statementCreated = await inMemoryStatementsRepository.create(statement)

        const statementsUser = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statementCreated.id as string,
        })

        expect(statementsUser).toHaveProperty('id')
    })

    it("Should not be able to get a statement from a non-existing user", ()=>{
        expect(async ()=>{
            await getStatementOperationUseCase.execute({
                user_id: "test",
                statement_id: 'statementId' as string,
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    })

    it("Should not be able to get a statement from a non-existing statement", ()=>{
        expect(async ()=>{
            const user = await inMemoryUsersRepository.create({
                name: 'Test', 
                email: 'test@jest.test.com', 
                password:  'test' 
            })

            await getStatementOperationUseCase.execute({
                user_id: user.id as string,
                statement_id: 'statementId' as string,
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    })
});