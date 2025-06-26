export const priorityOrder = ["vermelho", "laranja", "amarelo", "verde", "azul"];
export const maximumTime: { [cor: string]: number } = { 
  vermelho: 0,
  laranja: 10 * 60 * 1000,
  amarelo: 60 * 60 * 1000,
  verde: 120 * 60 * 1000,
  azul: 240 * 60 * 1000
};