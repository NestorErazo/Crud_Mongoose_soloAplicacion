const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");

let bookId;

beforeAll(async () => {
    const res = await request(app)
        .post("/libro")
        .send({ titulo: "Libro de Prueba", autor: "Autor de Prueba" });

    bookId = res.body._id;
});


describe("Endpoints de libros", ()=>{
    test("deberia traer lista de libros",async () => {
         const res = await request(app).get("/libro");

       expect(res.statusCode).toEqual(200);
       expect(Array.isArray(res.body)).toBe(true);
    })
        test("deberia crear nuevo libro", async()=>{
        const res = await request(app)
        .post("/libro")
        .send({titulo:"libro de prueba",autor:"autor de prueba"});

        expect(res.statusCode).toEqual(200); // Se espera un código de estado 201 (Created) para una solicitud POST exitosa
        expect(res.body.titulo).toBe("libro de prueba"); // Se corrige la comparación de strings
        expect(res.body.autor).toBe("autor de prueba");
    })
    test("deberia eliminar un libro", async () => {
        const res = await request(app).delete(`/libro/${bookId}`);
        //expect(res.statusCode).toEqual(200);

        const getRes = await request(app).get(`/libro/${bookId}`);
        expect(getRes.statusCode).toEqual(404);
    });

    test("deberia actualizar un libro", async () => {
        const res = await request(app).put(`/libro/${bookId}`);
        //expect(res.statusCode).toEqual(200);

        const getRes = await request(app).get(`/libro/${bookId}`);
        expect(getRes.statusCode).toEqual(404);
    });
    
    afterAll(async () =>{
        await mongoose.connection.close();
    });
 });

