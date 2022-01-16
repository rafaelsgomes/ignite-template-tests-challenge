import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase
describe('Show user profile', ()=>{
    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository()
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    })
    it("Should be able to show a user's profile", async ()=>{
        const user = await inMemoryUsersRepository.create({ 
            name: 'Test', 
            email: 'test@jest.test.com', 
            password:  'test' })

        const userFind = await showUserProfileUseCase.execute(user.id as string)
        expect(userFind).toHaveProperty('id')
        expect(userFind.name).toBe('Test')
    });

    it("Should not be able to show an no-existing user profile", ()=>{
        expect(async ()=>{
            await showUserProfileUseCase.execute("idTest")
        }).rejects.toBeInstanceOf(ShowUserProfileError)
    })
})