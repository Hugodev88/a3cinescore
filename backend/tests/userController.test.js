const request = require('supertest');
const app = require('../index'); // Seu app configurado

describe('UserController', () => {
  it('should create a new user and return status 201', async () => {
    const newUser = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      confirmpassword: 'password123' // Confirmando a senha
    };

    // Envia a requisição POST para a rota de registro
    const res = await request(app)
      .post('/register') // Rota de registro
      .send(newUser) // Dados do novo usuário
      .expect(201); // Espera o status 201 (Created)

    // Verifica se a resposta contém o token e o userId
    expect(res.body.message).toBe('Voce está autenticado');
    expect(res.body.token).toBeDefined();
    expect(res.body.userId).toBeDefined();
  });
});