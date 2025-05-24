
import Prompt from "prompt-sync";
const prompt = Prompt();

class Person {
  protected id: string;

  constructor(id: string) {
    this.id = id;
  }

  public getInfo(): string {
    return `ID: ${this.id}`;
  }

  public getId(): string {
    return this.id;
  }
}

class Patient extends Person {
  protected getInLine: number;

  constructor(id: string) {
    super(id);
    this.getInLine = Date.now();
  }

  public getTime(): number {
    return this.getInLine;
  }

  public override getInfo(): string {
    const waiting = Math.floor((Date.now() - this.getInLine) / 60000);
    return `Paciente ${this.getId()} - Esperando há ${waiting} minutos`;
  }
}

class Line {
  items: Patient[] = [];

  enqueue(paciente: Patient): void {
    this.items.push(paciente);
  }

  dequeue(): Patient | undefined {
    return this.items.shift();
  }

  peek(): Patient | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  list(): string[] {
    return this.items.map(p => p.getId());
  }
}

const lines: { [color: string]: Line } = {
  vermelho: new Line(),
  laranja: new Line(),
  amarelo: new Line(),
  verde: new Line(),
  azul: new Line()
};

const priorityOrder = ["vermelho", "laranja", "amarelo", "verde", "azul"];

const maximumTime: { [cor: string]: number } = {
  vermelho: 0,
  laranja: 10 * 60 * 1000,
  amarelo: 60 * 60 * 1000,
  verde: 120 * 60 * 1000,
  azul: 240 * 60 * 1000
};

let patientCounter = 1;

function generateId(): string {
  const id = patientCounter.toString().padStart(3, "0");
  patientCounter++;
  if (patientCounter > 200) patientCounter = 1;
  return id;
}

function registerPatient() {
  const id = generateId();
  const priority = prompt("Cor da prioridade (vermelho, laranja, amarelo, verde, azul): ").toLowerCase();

  if (!lines[priority]) {
    console.log("Cor inválida. Paciente não cadastrado.");
    return;
  }

  lines[priority].enqueue(new Patient(id));
  console.log(`Paciente ${id} adicionado à fila ${priority.toUpperCase()}`);
}

function servePatient() {
  let PatientTreated: Patient | undefined = undefined;
  let lineSelected = "";

  for (const color of priorityOrder) {
    const fila = lines[color];
    const patient = fila.peek();
    if (patient) {
      const now = Date.now();
      const maxTime = maximumTime[color];
      const WaitingTime = now - patient.getTime();
      const remaining = maxTime - WaitingTime;

      if (maxTime === 0) {
        console.log(`[IMEDIATO!] Paciente ${patient.getId()} (${color.toUpperCase()}) deve ser atendido agora!`);
      } else if (remaining <= 0) {
        console.log(`[ATRASADO!] Tempo esgotado para o paciente ${patient.getId()} (${color.toUpperCase()})!`);
      } else if (remaining <= 10 * 60 * 1000) {
        console.log(`[AVISO] Faltam menos de 10 minutos para o tempo de espera do paciente ${patient.getId()} (${color.toUpperCase()})!`);
      }

      PatientTreated = fila.dequeue();
      lineSelected = color;
      break;
    }
  }

  if (PatientTreated) {
    console.log(`Paciente ${PatientTreated.getId()} foi atendido da fila ${lineSelected.toUpperCase()}`);
  } else {
    console.log("Nenhum paciente aguardando atendimento.");
  }
}

function seeLines() {
  console.log("\n=== FILAS ATUAIS ===");
  for (const cor of priorityOrder) {
    console.log(`${cor.toUpperCase()}: [${lines[cor].list().join(", ")}]`);
  }
}

function checkTimes() {
  const now = Date.now();
  console.log("\n=== TEMPOS DE ESPERA ===");
  for (const color of priorityOrder) {
    const line = lines[color];
    if (!line.isEmpty()) {
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
          console.log(`[AVISO!] Faltam menos de 10 minutos para o tempo de espera do paciente ${patient.getId()} (${color.toUpperCase()})!`);
        }
      });
    }
  }
}

function menu() {
  while (true) {
    console.log("\nSISTEMA DE TRIAGEM");
    console.log("1 - Cadastrar paciente");
    console.log("2 - Atender próximo paciente");
    console.log("3 - Consultar filas");
    console.log("4 - Verificar tempos de espera");
    console.log("5 - Sair");
    const option = prompt("Escolha uma opção: ");

    switch (option) {
      case "1":
        registerPatient();
        break;
      case "2":
        servePatient();
        break;
      case "3":
        seeLines();
        break;
      case "4":
        checkTimes();
        break;
      case "5":
        console.log("Encerrando o sistema.");
        return;
      default:
        console.log("Opção inválida.");
    }
  }
}

menu();