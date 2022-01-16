import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Create user', ()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    })

    it("Should be able to create a new user", async ()=>{
        const user = await createUserUseCase.execute({ 
            name: 'Test', 
            email: 'test@jest.test.com', 
            password:  'test' 
        })

        expect(user).toHaveProperty('id')
        expect(user.name).toBe('Test')
    })

    it("Should not be able to create a new user with the same email", ()=>{
        expect(async ()=>{
            await createUserUseCase.execute({ 
                name: 'Test', 
                email: 'test@jest.test.com', 
                password:  'test' 
            })

            await createUserUseCase.execute({ 
                name: 'Test', 
                email: 'test@jest.test.com', 
                password:  'test' 
            })
        }).rejects.toBeInstanceOf(CreateUserError)
    })
})