import request from 'supertest';
import { Connection, createConnection } from 'typeorm';

import {app} from '../../../../app'

let connection: Connection;

describe("Authenticate user controller", ()=>{
    beforeAll(async ()=>{
        connection = await createConnection()
        await connection.runMigrations()

        await request(app)
        .post('/api/v1/users')
        .send({
          name: 'User Supertest',
          email: 'test@integrationtest.com',
          password: "integrationtest"
        });
        
    })

    afterAll(async ()=>{
        await connection.dropDatabase();
        await connection.close();
    })

    it('Should be able to authenticate a user', async ()=>{
            const response = await request(app)
            .post('/api/v1/sessions')
            .send({
              email: 'test@integrationtest.com',
              password: "integrationtest"
            });

          expect(response.status).toBe(200);
          expect(response.body).toHaveProperty('token');
    })
    
    it("Should not be able to authenticate a nonexistent user", async ()=>{
        const response = await request(app)
            .post('/api/v1/sessions')
            .send({
              email: 'test@integrationtest2.com',
              password: "integrationtest"
        });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({message: 'Incorrect email or password'});
    })

    it("Should not be able to authenticate a user with invalid password", async ()=>{
        const response = await request(app)
            .post('/api/v1/sessions')
            .send({
              email: 'test@integrationtest.com',
              password: "integrationtest2"
        });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({message: 'Incorrect email or password'});
    })
})