import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { GetBalanceError } from "./GetBalanceError";


let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let getBalanceUseCase: GetBalanceUseCase

describe('Get balance', ()=>{
    beforeEach(()=>{
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    })
    it("Should be able to get a user balance", async ()=>{
        const user = await inMemoryUsersRepository.create({
            name: 'Test', 
            email: 'test@jest.test.com', 
            password:  'test' 
        })

        const balance = await getBalanceUseCase.execute({user_id: user.id as string})

        expect(balance).toHaveProperty('statement')
    })

    it("Should not be able to get a balance from a non-existing user", ()=>{
        expect(async ()=>{
            await getBalanceUseCase.execute({user_id: "userID"})
        }).rejects.toBeInstanceOf(GetBalanceError)
    })
});