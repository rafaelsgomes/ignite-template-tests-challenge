import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { ICreateStatementDTO } from './ICreateStatementDTO'
import { CreateStatementError } from "./CreateStatementError";


let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createStatementUseCase: CreateStatementUseCase

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer'
  }
  

describe('Create statement', ()=>{
    beforeEach(()=>{
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    })
    it("Should be able to create a user statement", async ()=>{
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
        const statementCreated = await createStatementUseCase.execute(statement)

        expect(statementCreated).toHaveProperty('id')
    })

    it("Should not be able to create a statement from a non-existing user", ()=>{
        expect(async ()=>{
            await createStatementUseCase.execute({
                user_id: "userID", 
                type: OperationType.DEPOSIT, 
                amount: 1500, 
                description: 'test'
            })
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    })

    it("Should not be able to create a statement withdraw if insufficient funds", ()=>{
        expect(async ()=>{
            const user = await inMemoryUsersRepository.create({
                name: 'Test', 
                email: 'test@jest.test.com', 
                password:  'test' 
            })
    
            const statement: ICreateStatementDTO = {
                user_id: user.id as string, 
                type: OperationType.WITHDRAW, 
                amount: 100, 
                description: 'test'
    
            }            
            await createStatementUseCase.execute(statement)

        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    })
});