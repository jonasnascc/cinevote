const request = require("supertest")
const {app, conn} = require("../src/app");
const User = require("../src/models/User");
const Playlist = require("../src/models/Playlist");

const PLAYLIST_ENDPOINT = "/playlists"

const USER_EMAIL = "testUserPlist@test.com"

let vanish_ids = []

beforeAll(async () => {
    await conn.sync({logging:false}).catch(error => console.log(error));
});

afterAll(async () => {
    await User.destroy({where:{email: USER_EMAIL}})

    await Playlist.destroy({where:{id:vanish_ids}})

    vanish_ids = []

    await conn.close();
});


async function getAuthToken() {
    const user = {
        name: "Test User",
        email: USER_EMAIL,
        password: "test123",
        passwordConfirm: "test123"
    }

    await User.destroy({where:{email: USER_EMAIL}})

    const resp = await request(app).post("/users/register")
        .send(user)


    return `Bearer ${resp.body.token ?? ""}`
}

describe(`POST ${PLAYLIST_ENDPOINT}`, () => {
    describe("given name, maxDuration, maxSize, isPublic", () => {
        test("should response with a 200 status code when successfully created", async () => {
            const playlist = {
                name: "Test Playlist", 
                maxDuration : "100", 
                maxSize : 10, 
                isPublic : true
            }

            const token = await getAuthToken()

            const response = await request(app).post(PLAYLIST_ENDPOINT)
                .set("Authorization", token)
                .send(playlist) 

            const id = response.body.playlist.id
            if(id !== undefined) vanish_ids.push(id)

            expect(response.statusCode).toBe(200)
        })

        test("should response with a 422 status code when name is empty or null", async () => {
            const values = [null, ""]

            for(let val of values) {
                const playlist = {
                    name: val, 
                    maxDuration : "200", 
                    maxSize : 10, 
                    isPublic : true
                }
    
                const token = await getAuthToken()
    
                const response = await request(app).post(PLAYLIST_ENDPOINT)
                    .set("Authorization", token)
                    .send(playlist) 
    
                expect(response.statusCode).toBe(422)
            }
            
        })

        test("should response with a 401 status code when token is ausent", async () => {
            const playlist = {
                name: "Test Playlist", 
                maxDuration : "300", 
                maxSize : 10, 
                isPublic : true
            }

            const response = await request(app).post(PLAYLIST_ENDPOINT)
                .send(playlist) 

            expect(response.statusCode).toBe(401)
        })
    })


    describe("given only name", () => {
        test("should response with a 200 status code when successfully created", async () => {
            const playlist = {
                name: "Test Playlist"
            }

            const token = await getAuthToken()

            const response = await request(app).post(PLAYLIST_ENDPOINT)
                .set("Authorization", token)
                .send(playlist) 

            const id = response.body.playlist.id
            if(id !== undefined) vanish_ids.push(id)

            expect(response.statusCode).toBe(200)
        })
    })
})

describe(`GET ${PLAYLIST_ENDPOINT}`, () => {
    describe(`given none`, () => {
        test("should respond with a 200 status code and a playlists array", async () => {
            const token = await getAuthToken()
    
            const create1Resp = await request(app)
                .post(PLAYLIST_ENDPOINT)
                .set("Authorization", token)
                .send({
                    name: "Test Playlist 1", 
                    maxDuration : "400", 
                    maxSize : 10, 
                    isPublic : true
                }) 

            const create2Resp = await request(app)
                .post(PLAYLIST_ENDPOINT)
                .set("Authorization", token)
                .send({
                    name: "Test Playlist 2", 
                    maxDuration : "450", 
                    maxSize : "20", 
                    isPublic : false
                }) 


            expect(create1Resp.statusCode).toBe(200)
            expect(create2Resp.statusCode).toBe(200)

            const id1 = create1Resp.body.playlist.id
            if(id1 !== undefined) vanish_ids.push(id1)

            const id2 = create2Resp.body.playlist.id
            if(id2 !== undefined) vanish_ids.push(id2)

            const response = await request(app)
                .get(PLAYLIST_ENDPOINT)
                .set("Authorization", token)

            expect(response.statusCode).toBe(200)
            expect(response.body.playlists).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                        inviteCode: expect.any(String),
                        isPublic: expect.any(Boolean),
                        maxDuration: expect.any(String),
                        maxSize: expect.any(Number),
                        OwnerId: expect.any(Number),
                    })
                ])
            );
        })

        test("should respond with a 200 status code and a empty array", async () => {
            const token = await getAuthToken()

            const response = await request(app)
                .get(PLAYLIST_ENDPOINT)
                .set("Authorization", token)

            expect(response.statusCode).toBe(200)
            expect(response.body.playlists).toEqual([]);
        })

        test("should response with a 401 status code when token is ausent", async () => {
            const response = await request(app)
                .get(PLAYLIST_ENDPOINT)

            expect(response.statusCode).toBe(401)
        })
    })
    describe(`given playlist id`, () => {
        test("should respond with a 200 status code and playlist when playlist is found", async () => {
            const token = await getAuthToken()
    
            const createResp = await request(app)
                .post(PLAYLIST_ENDPOINT)
                .set("Authorization", token)
                .send({
                    name: "Test Playlist", 
                    maxDuration : "400", 
                    maxSize : 10, 
                    isPublic : true
                }) 

            expect(createResp.statusCode).toBe(200)

            const id = createResp.body.playlist.id
            if(id !== undefined) vanish_ids.push(id)

            const response = await request(app)
                .get(PLAYLIST_ENDPOINT + `/${id}`)
                .set("Authorization", token)

            expect(response.statusCode).toBe(200)
            expect(response.body.playlist).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                inviteCode: expect.any(String),
                isPublic: expect.any(Boolean),
                maxDuration: expect.any(String),
                maxSize: expect.any(Number),
                OwnerId: expect.any(Number)
            })
        })

        test("should respond with a 404 status code when playlist is not found", async () => {
            const token = await getAuthToken()

            const response = await request(app)
                .get(PLAYLIST_ENDPOINT + `/${200}`)
                .set("Authorization", token)

            expect(response.statusCode).toBe(404)
        })

        test("should response with a 401 status code when token is ausent", async () => {
            const response = await request(app)
                .get(PLAYLIST_ENDPOINT + `/${200}`)

            expect(response.statusCode).toBe(401)
        })
    })

    describe(`given playlist inviteCode`, () => {
        test("should respond with a 200 status code and playlist when playlist is found", async () => {
            const token = await getAuthToken()
    
            const createResp = await request(app)
                .post(PLAYLIST_ENDPOINT)
                .set("Authorization", token)
                .send({
                    name: "Test Playlist", 
                    maxDuration : "400", 
                    maxSize : 10, 
                    isPublic : true
                }) 

            expect(createResp.statusCode).toBe(200)

            const id = (await Playlist.findOne({where:{inviteCode: createResp.body.playlist.inviteCode}})).id
            if(id !== undefined) vanish_ids.push(id)

            const response = await request(app)
                .get(PLAYLIST_ENDPOINT  + `/inviteCode/${createResp.body.playlist.inviteCode}`)
                .set("Authorization", token)

            expect(response.statusCode).toBe(200)
            expect(response.body.playlist).toMatchObject({
                name: expect.any(String),
                inviteCode: expect.any(String),
                isPublic: expect.any(Boolean),
                maxDuration: expect.any(String),
                maxSize: expect.any(Number)
            })
        })

        test("should respond with a 404 status code when playlist is not found", async () => {
            const token = await getAuthToken()

            const response = await request(app)
                .get(PLAYLIST_ENDPOINT  + `/inviteCode/testInviteCode`)
                .set("Authorization", token)

            expect(response.statusCode).toBe(404)
        })

        test("should response with a 401 status code when token is ausent", async () => {
            const response = await request(app)
                .get(PLAYLIST_ENDPOINT  + `/inviteCode/testInviteCode`)

            expect(response.statusCode).toBe(401)
        })
    })
})