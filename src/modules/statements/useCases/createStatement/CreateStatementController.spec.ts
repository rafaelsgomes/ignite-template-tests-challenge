import request from 'supertest';
import { Connection, createConnection } from 'typeorm';

import {app} from '../../../../app'

let connection: Connection;
describe("Create statement controller", ()=>{
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

    it('Should be able to create a deposit statement for a user', async ()=>{
        const session = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'test@integrationtest.com',
            password: "integrationtest"
        });

        const response = await request(app)
        .post('/api/v1/statements/deposit')
        .send({
            amount: 150,
            description: "deposit supertest"
        })
        .set({
            Authorization: `Bearer ${session.body.token}`,
        });

        expect(response.status).toBe(201);
        expect(response.body.type).toEqual('deposit');
    })


    it('Should be able to create a withdraw statement for a user if balance > amount', async ()=>{
        const session = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'test@integrationtest.com',
            password: "integrationtest"
        });

        const response = await request(app)
        .post('/api/v1/statements/withdraw')
        .send({
            amount: 100,
            description: "withdraw supertest"
        })
        .set({
            Authorization: `Bearer ${session.body.token}`,
        });

        expect(response.status).toBe(201);
        expect(response.body.type).toEqual('withdraw');
    })

    it('Should not be able to create a withdraw statement for a user if balance < amount', async ()=>{
        const session = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'test@integrationtest.com',
            password: "integrationtest"
        });

        const response = await request(app)
        .post('/api/v1/statements/withdraw')
        .send({
            amount: 200,
            description: "withdraw supertest"
        })
        .set({
            Authorization: `Bearer ${session.body.token}`,
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Insufficient funds'});
    })
})