import axios from 'axios';

// Defina a URL base. Mantenha em uma variável de ambiente para produção!
// Por agora, use a URL que o seu time definiu para desenvolvimento:
const BASE_URL = 'http://localhost:3333'; // Exemplo comum para Node/Express

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;