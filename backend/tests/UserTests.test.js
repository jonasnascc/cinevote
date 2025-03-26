const request = require("supertest")
const {app, conn} = require("../src/app")

const USED_EMAILS = [
    "testUser@test.com",
    "duplicatedUser@test.com",
    "user123@test.com",
    "userTest@test.com",
    "userTest123@test.com",
]

const REGISTER_ENDPOINT = "/users/register"
const LOGIN_ENDPOINT = "/users/login"
const CHECK_ENDPOINT = "/users/checkuser"

const User = require("../src/models/User")

beforeAll(async () => {
    await conn.sync({logging:false}).catch(error => console.log(error));
});

afterAll(async () => {
    for(let email of USED_EMAILS) {
        await User.destroy({where: {email}})
    }
    await conn.close();
});

describe(`POST ${REGISTER_ENDPOINT}`, () => {
    describe("given name, email and password", () => {
        test("should respond with a 200 status code when user is successfully created", async () => {
            await User.destroy({where:{email:USED_EMAILS[0]}})
            const response = await request(app).post(REGISTER_ENDPOINT).send({
                name: "user_test",
                email: USED_EMAILS[0],
                password: "test123",
                passwordConfirm: "test123"
            })
            expect(response.statusCode).toBe(200)
        })

        test("should respond with a 422 status code when email is already registered", async () => {
            await User.destroy({where:{email:USED_EMAILS[1]}})
            
            await request(app).post(REGISTER_ENDPOINT).send({
                name: "user123",
                email: USED_EMAILS[1],
                password: "test12345",
                passwordConfirm: "test12345"
            })

            const response = await request(app).post(REGISTER_ENDPOINT).send({
                name: "user_test",
                email: USED_EMAILS[1],
                password: "test123",
                passwordConfirm: "test123"
            })
            
            expect(response.statusCode).toBe(422)
        })

        test("should respond with a 422 status code when password and passwordConfirm are differents", async () => {
            await User.destroy({where:{email:USED_EMAILS[3]}})

            const response = await request(app).post(REGISTER_ENDPOINT)
                .send({
                    name: "test_user",
                    email: USED_EMAILS[3],
                    password: "test12345",
                    passwordConfirm: "wrong12345"
                })

            expect(response.statusCode).toBe(422)
        })
    })

    describe("given user with a missing attribute", () => {
        test("should respond with a 422 status code", async () => {
            await User.destroy({where:{email:USED_EMAILS[2]}})
            
            const user = {
                name: "test_user",
                email: USED_EMAILS[2],
                password: "test12345",
                passwordConfirm: "test12345"
            }

            console.log({
                ...user,
                name: undefined
            })
            let response = await request(app).post(REGISTER_ENDPOINT)
                .send({
                    ...user,
                    name: undefined
                })
            expect(response.statusCode).toBe(422)


            response = await request(app).post(REGISTER_ENDPOINT)
                .send({
                    ...user,
                    email: undefined
                })
            expect(response.statusCode).toBe(422)
            
            response = await request(app).post(REGISTER_ENDPOINT)
                .send({
                    ...user,
                    password: undefined
                })
            expect(response.statusCode).toBe(422)

            response = await request(app).post(REGISTER_ENDPOINT)
                .send({
                    ...user,
                    passwordConfirm: undefined
                })
            expect(response.statusCode).toBe(422)
        })
    })
})

describe(`POST ${LOGIN_ENDPOINT}`, () => {
    describe("given email and password", () => {
        test("should respond with a 200 status code when user is authenticated", async () => {
            await User.destroy({where:{email:USED_EMAILS[0]}})
            const user = {
                name: "Test User",
                email: USED_EMAILS[0],
                password: "testUserPassword123",
                passwordConfirm: "testUserPassword123"
            }
    
            const createResp = await request(app).post(REGISTER_ENDPOINT).send(user)

            if(createResp.statusCode == 200) {
                const response = await request(app).post(LOGIN_ENDPOINT)
                .send({email:user.email, password:user.password})
    
                expect(response.statusCode).toBe(200)
            }

            expect(createResp.statusCode).toBe(200)
        })

        test("should respond with a 422 status code when email or password is invalid", async () => {
            await User.destroy({where:{email:USED_EMAILS[0]}})

            const response = await request(app).post(LOGIN_ENDPOINT)
                .send({email: USED_EMAILS[0], password:"testPass123"})

            expect(response.statusCode).toBe(422)
        })

        test("should respond with a 422 status code when email is empty", async () => {
            const response = await request(app).post(LOGIN_ENDPOINT)
                .send({email: "", password:"testPass123"})

            expect(response.statusCode).toBe(422)
        })

        test("should respond with a 422 status code when password is empty", async () => {
            const response = await request(app).post(LOGIN_ENDPOINT)
                .send({email: "test@mail.com", password:""})

            expect(response.statusCode).toBe(422)
        })
    })

    describe(`GET ${CHECK_ENDPOINT}`, () => {
        describe("when user is authenticated", () => {
            test("should respond with a 200 status code with body containing User", async () => {
                await User.destroy({where:{email:USED_EMAILS[0]}})

                const registerResponse = await request(app).post(REGISTER_ENDPOINT)
                    .send({
                        name: "Test User",
                        email: USED_EMAILS[0],
                        password: "test12345",
                        passwordConfirm: "test12345"
                    })
                    
                const token = registerResponse.body.token ?? ""
                const response = await request(app).get(CHECK_ENDPOINT).auth(token, {type: "bearer"})

                expect(response.statusCode).toBe(200)

                expect(response.body).toMatchObject({
                    id: expect.any(Number),
                    name: expect.any(String),
                    email: expect.any(String)
                })
            })
        })

        describe("when user is not authenticated", () => {
            test("should respond with a 200 status code with empty body", async () => {
                const response = await request(app).get(CHECK_ENDPOINT)

                expect(response.statusCode).toBe(200)

                expect(response.body).toMatchObject({})
            })
        })
    })
})

