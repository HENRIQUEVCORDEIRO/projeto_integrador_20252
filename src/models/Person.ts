export class Person {
  protected id: string;

  constructor(id: string) {
    this.id = id;
  }

  public getId(): string {
    return this.id;
  }

  public getInfo(): string {
    return `ID: ${this.id}`;
  }
}