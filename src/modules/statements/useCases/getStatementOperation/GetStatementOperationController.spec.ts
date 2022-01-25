import request from 'supertest';
import { Connection, createConnection } from 'typeorm';

import {app} from '../../../../app'

let connection: Connection;
describe("Get statement operation controller", ()=>{
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

    it('Should be able to show the statement operation for a user', async ()=>{
        const session = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'test@integrationtest.com',
            password: "integrationtest"
        });
        

        const operation = await request(app)
        .post('/api/v1/statements/deposit')
        .send({
            amount: 150,
            description: "deposit supertest"
        })
        .set({
            Authorization: `Bearer ${session.body.token}`,
        });

        const { id } = operation.body

        const response = await request(app)
        .get(`/api/v1/statements/${id}`)
        .set({
            Authorization: `Bearer ${session.body.token}`,
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    })

    it('Should not be able to show the a nonexistent statement operation for a user', async ()=>{
        const session = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'test@integrationtest.com',
            password: "integrationtest"
        });
        
        const id = "Id"
        const response = await request(app)
        .get(`/api/v1/statements/${id}`)
        .set({
            Authorization: `Bearer ${session.body.token}`,
        });

        expect(response.status).toBe(500);
    })
})