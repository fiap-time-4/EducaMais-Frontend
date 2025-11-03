import axios from 'axios';

// URL base da sua API backend
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  !! NOTA PARA O PACOTE 3 (AUTH) !!
  
  É aqui que você deve adicionar o "interceptor" do Axios.
  Este interceptor irá ler o token (do cookie ou do AuthContext)
  e adicioná-lo ao header 'Authorization' de todas as requisições
  que saírem deste apiClient.
  
  Exemplo:
  
  apiClient.interceptors.request.use((config) => {
    const token = // ...lógica para pegar o token...
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
*/

export default apiClient;