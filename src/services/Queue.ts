import { Patient } from "../models/Patient"; 

export class Queue { 
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