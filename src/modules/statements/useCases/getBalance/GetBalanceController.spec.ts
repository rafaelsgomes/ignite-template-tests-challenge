import request from 'supertest';
import { Connection, createConnection } from 'typeorm';

import {app} from '../../../../app'

let connection: Connection;
describe("Get balance controller", ()=>{
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

    it('Should be able to show the balance for a user', async ()=>{
        const session = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'test@integrationtest.com',
            password: "integrationtest"
        });

        const response = await request(app)
        .get('/api/v1/statements/balance')
        .set({
            Authorization: `Bearer ${session.body.token}`,
        });

        expect(response.status).toBe(200);
    })
})