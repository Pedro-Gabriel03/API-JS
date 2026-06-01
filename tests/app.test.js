const request = require('supertest');
const app = require('../src/app');

describe('Testes da API de Endereços Corporativa', () => {
    
    it('Deve retornar status online na rota raiz', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toBe('online');
    });

    it('Deve retornar os dados corretos para um CEP válido (Praça da Sé)', async () => {
        const res = await request(app).get('/endereco/01001000');
        expect(res.statusCode).toEqual(200);
        expect(res.body.cidade).toBe('São Paulo');
        expect(res.body.estado).toBe('SP');
        expect(res.body).toHaveProperty('logradouro');
        expect(res.body).toHaveProperty('ibge');
    });

    it('Deve retornar erro 404 para CEP com 8 dígitos, mas inexistente', async () => {
        const res = await request(app).get('/endereco/99999999');
        expect(res.statusCode).toEqual(404);
        expect(res.body.detail).toBe('CEP não encontrado na base de dados');
    });

    it('Deve retornar erro 400 ao enviar CEP contendo letras', async () => {
        const res = await request(app).get('/endereco/abc12345');
        expect(res.statusCode).toEqual(400);
        expect(res.body.detail).toMatch(/inválido/i);
    });

    it('Deve retornar erro 400 ao enviar CEP com menos de 8 dígitos', async () => {
        const res = await request(app).get('/endereco/12345');
        expect(res.statusCode).toEqual(400);
        expect(res.body.detail).toMatch(/inválido/i);
    });
});