import prompt from "../prompt";
import { Queue } from "./Queue";
import { Patient } from "../models/Patient";
import { generateId } from "../utils/idGenerator";
import { priorityOrder, maximumTime } from "../config/triageConfig";


export const filaRecepcao = new Queue();
export const queues: { [color: string]: Queue } = {
  vermelho: new Queue(),
  laranja: new Queue(),
  amarelo: new Queue(),
  verde: new Queue(),
  azul: new Queue()
};


export function registrarNaRecepcao(): void { 
  const id = generateId();

  const street = prompt("Digite a rua do paciente: ");
  const neighborhood = prompt("Digite o bairro do paciente: ");
  const phone = prompt("Digite o telefone do paciente: ");
  const dateOfBirth = prompt("Digite a data de nascimento do paciente (DD/MM/AAAA): ");


  const paciente = new Patient(id, street, neighborhood, phone, dateOfBirth);
  filaRecepcao.enqueue(paciente);
  console.log(`Paciente ${id} registrado na recepção com os dados fornecidos.`);
}


export function enviarParaTriagem(): void { 
  if (filaRecepcao.isEmpty()) {
    console.log("Não há pacientes na recepção.");
    return;
  }

  const paciente = filaRecepcao.dequeue()!;
  const prioridade = prompt(
    `Qual a cor da triagem para o paciente ${paciente.getId()}? (vermelho, laranja, amarelo, verde, azul): `
  ).toLowerCase();

  if (!queues[prioridade]) {
    console.log("Cor inválida. Paciente não encaminhado. Retornando à recepção.");
    filaRecepcao.enqueue(paciente);
    return;
  }

  queues[prioridade].enqueue(paciente);
  console.log(`Paciente ${paciente.getId()} enviado para a fila ${prioridade.toUpperCase()}.`);
}


export function servePatient(): void { 
  let urgentPatient: Patient | undefined = undefined;
  let urgentColor = "";
  let minRemaining = Infinity;
  const now = Date.now();

  for (const color of priorityOrder) {
    const fila = queues[color];
    const patient = fila.peek();

    if (patient) {
      const maxTime = maximumTime[color];
      const waitingTime = now - patient.getTime();
      const remaining = maxTime - waitingTime;

      if (maxTime === 0) {
        console.log(`[IMEDIATO!] Paciente ${patient.getId()} (${color.toUpperCase()}) deve ser atendido agora!`);
        urgentPatient = patient;
        urgentColor = color;
        break;
      }

      if (remaining <= 0) {
        console.log(`[ATRASADO!] Tempo esgotado para o paciente ${patient.getId()} (${color.toUpperCase()})!`);
        if (remaining < minRemaining) {
          urgentPatient = patient;
          urgentColor = color;
          minRemaining = remaining;
        }
      } else if (remaining <= 10 * 60 * 1000) {
        console.log(`[AVISO] Faltam menos de 10 minutos para o paciente ${patient.getId()} (${color.toUpperCase()})!`);
        if (remaining < minRemaining) {
          urgentPatient = patient;
          urgentColor = color;
          minRemaining = remaining;
        }
      } else if (!urgentPatient) {
        urgentPatient = patient;
        urgentColor = color;
        minRemaining = remaining;
      }
    }
  }

  if (urgentPatient) {
    queues[urgentColor].dequeue();
    console.log(`Paciente ${urgentPatient.getId()} foi atendido da fila ${urgentColor.toUpperCase()}.`);
  } else {
    console.log("Nenhum paciente aguardando atendimento.");
  }
}


export function seeLines(): void {
  console.log("\nFILAS DE TRIAGEM:");
  for (const color of priorityOrder) {
    console.log(`${color.toUpperCase()}: [${queues[color].list().join(", ")}]`);
  }
}


export function checkTimes(): void {
  const now = Date.now();
  console.log("\nTEMPOS DE ESPERA:");
  let anyPatientWaiting = false;
  for (const color of priorityOrder) {
    const line = queues[color];
    if (!line.isEmpty()) {
      anyPatientWaiting = true;
      line.items.forEach(patient => {
        console.log(`${patient.getInfo()} (${color.toUpperCase()})`);
        const time = now - patient.getTime();
        const maxTime = maximumTime[color];
        const restante = maxTime - time;

        if (maxTime === 0) {
          console.log(`[IMEDIATO!] Paciente ${patient.getId()} (${color.toUpperCase()}) deve ser atendido agora!`);
        } else if (restante <= 0) {
          console.log(`[ATRASADO!] Tempo esgotado para o paciente ${patient.getId()} (${color.toUpperCase()})!`);
        } else if (restante <= 10 * 60 * 1000) {
          console.log(`[AVISO!] Faltam menos de 10 minutos para o paciente ${patient.getId()} (${color.toUpperCase()})!`);
        }
      });
    }
  }
  if (!anyPatientWaiting) {
    console.log("Nenhum paciente aguardando nas filas de triagem.");
  }
}


export function verRecepcao(): void {
  console.log("RECEPÇÃO: [" + filaRecepcao.list().join(", ") + "]");
}