import { Person } from "./Person";

export class Patient extends Person {
  protected getInLine: number;
  private street: string;
  private neighborhood: string;
  private phone: string;
  private dateOfBirth: string;

  constructor(
    id: string,

    street: string,
    neighborhood: string,
    phone: string,
    dateOfBirth: string
  ) {
    super(id); 
    this.getInLine = Date.now();
   
    this.street = street;
    this.neighborhood = neighborhood;
    this.phone = phone;
    this.dateOfBirth = dateOfBirth;
  }

  public getTime(): number {
    return this.getInLine;
  }

  public override getInfo(): string {
    const waiting = Math.floor((Date.now() - this.getInLine) / 60000);
    
    return `Paciente ${this.getId()} - Esperando há ${waiting} minutos\n` +
           `  Endereço: ${this.street}, ${this.neighborhood}\n` +
           `  Telefone: ${this.phone}\n` +
           `  Nascimento: ${this.dateOfBirth}`;
  }


  public getStreet(): string {
    return this.street;
  }

  public getNeighborhood(): string {
    return this.neighborhood;
  }

  public getPhone(): string {
    return this.phone;
  }

  public getDateOfBirth(): string {
    return this.dateOfBirth;
  }
}