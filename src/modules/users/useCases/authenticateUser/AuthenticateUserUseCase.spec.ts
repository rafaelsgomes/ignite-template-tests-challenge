import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import {CreateUserUseCase} from '../createUser/CreateUserUseCase'
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
describe('Authenticate user', ()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    })
    it("Should be able to authenticate a user", async ()=>{
        await createUserUseCase.execute({ 
            name: 'Test', 
            email: 'test@jest.test.com', 
            password:  'test',
        })

        const userAuthenticated = await authenticateUserUseCase.execute({
            email: 'test@jest.test.com',
            password: 'test',
        })
        expect(userAuthenticated.user).toHaveProperty("id")
        expect(userAuthenticated).toHaveProperty("token")
    });

    it("Should not be able to authenticate an no-existing user", ()=>{
        expect(async ()=>{
            await authenticateUserUseCase.execute({
                email: 'test@jest.test.com',
                password: 'test',
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    });

    it("Should not be able to authenticate a user with incorrect password", ()=>{
        expect(async ()=>{
            await createUserUseCase.execute({ 
                name: 'Test', 
                email: 'test@jest.test.com', 
                password:  'test',
            })
    
            await authenticateUserUseCase.execute({
                email: 'test@jest.test.com',
                password: 'Test',
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    });
})