const request = require("supertest")
const {app, conn} = require("../src/app")

const USED_EMAILS = [
    "testUser@mail.com",
    "duplicatedUser@mail.com",
    "user123@mail.com",
    "userTest@mail.com",
    "userTest123@mail.com",
]

const REGISTER_ENDPOINT = "/users/register"

const User = require("../src/models/User")

beforeAll(async () => {
    await conn.sync({logging:false}).catch(error => console.log(error));
});

afterAll(async () => {
    await conn.close();
});

// beforeEach(async () => {
//     await destroyUsedModels()
// })

// async function destroyUsedModels() {
//     for(let email of USED_EMAILS) {
//         await User.destroy({where: {email}})
//     }
// }

describe("POST /users/register" , () => {
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