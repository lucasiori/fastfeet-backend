import axios from 'axios';

export default async zipCode => {
  try {
    const api = axios.create({
      baseURL: `https://viacep.com.br/ws/${zipCode}/json/`,
    });

    const { data: address } = await api.get();

    return address.cep !== undefined;
  } catch (error) {
    return false;
  }
};
