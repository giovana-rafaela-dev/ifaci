export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

export interface NovoUsuario {
  nome: string;
  email: string;
  senha: string;
}

export interface Dispositivo {
  id: number;
  nome: string;
  tipo: string;
  ativo: boolean;
}

export interface SensorData {
  id: number;
  temperatura: number;
  pressao: number;
  velocidade: number;
  statusEsp: boolean;
  travaSeguranca: boolean;
  timestamp: string;
}