import request from 'supertest';
import { Connection, createConnection } from 'typeorm';

import {app} from '../../../../app'

let connection: Connection;

describe("Show user profile controller", ()=>{
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

    it('Should be able to show a user profile', async ()=>{
        const session = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'test@integrationtest.com',
            password: "integrationtest"
        });

        const response = await request(app)
        .get('/api/v1/profile')
        .set({
            Authorization: `Bearer ${session.body.token}`,
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    })
})