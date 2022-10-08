import request from 'supertest';
import { app } from '../../app';


it('Returns a 201 on successful signup', async () => {
    return request(app)
            .post('/api/users/signup')
            .send({
                email: 'nghi@gmail.com',
                password: 'password'
            })
            .expect(201);
})

it('Returns a 400 with an invalid email', async () => {
    return request(app)
            .post('/api/users/signup')
            .send({
                email: 'nghi',
                password: 'password'
            })
            .expect(400);
})

it('Disallow duplicate emails', async () => {
    await request(app)
            .post('/api/users/signup')
            .send({
                email: 'nghi@gmail.com',
                password: 'password'
            })
            .expect(201);
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'nghi@gmail.com',
            password: 'password'
        })
        .expect(400);            
})

it('Sets a cookie after successful signup', async () => {
    const response = await request(app)
                        .post('/api/users/signup')
                        .send({
                            email: 'nghi@gmail.com',
                            password: 'password'
                        })
                        .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined()
})



