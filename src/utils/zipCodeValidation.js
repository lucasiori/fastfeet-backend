import axios from 'axios';

export default async zipCode => {
  try {
    const api = axios.create({
      baseURL: `https://viacep.com.br/ws/${zipCode}/json/`,
    });

    const response = await api.get();

    return response.data && response.data.cep;
  } catch (error) {
    return false;
  }
};
