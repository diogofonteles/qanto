import { Injectable, BadRequestException } from '@nestjs/common';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

@Injectable()
export class ViaCepService {
  private readonly baseUrl = 'https://viacep.com.br/ws';

  async getAddressByCep(cep: string): Promise<ViaCepResponse> {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      throw new BadRequestException('CEP must have 8 digits');
    }

    try {
      const response = await fetch(`${this.baseUrl}/${cleanCep}/json/`);

      if (!response.ok) {
        throw new BadRequestException('Failed to fetch CEP');
      }

      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        throw new BadRequestException('CEP not found');
      }

      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to validate CEP');
    }
  }
}
