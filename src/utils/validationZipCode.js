import axios from 'axios';

export default async zip_code => {
  try {
    const api = axios.create({
      baseURL: `https://viacep.com.br/ws/${zip_code}/json/`,
    });

    const { data: address } = await api.get();

    return address.cep !== undefined;
  } catch (error) {
    return false;
  }
};
