import prompt from "./prompt";
import {
  registrarNaRecepcao,
  enviarParaTriagem,
  servePatient,
  seeLines,  
  checkTimes,
  verRecepcao
} from "./services/TriageService";

function menu(): void {
  while (true) {
    console.log("\nSISTEMA DE TRIAGEM:");
    console.log("0 - Registrar paciente na recepção");
    console.log("1 - Ver fila da recepção");
    console.log("2 - Encaminhar paciente da recepção para triagem");
    console.log("3 - Ver filas de triagem");
    console.log("4 - Ver tempos de espera");
    console.log("5 - Atender próximo paciente");
    console.log("6 - Sair");

    const option = prompt("Escolha uma opção: ");

    switch (option) {
      case "0":
        registrarNaRecepcao();
        break;
      case "1":
        verRecepcao();
        break;
      case "2":
        enviarParaTriagem();
        break;
      case "3":
        seeLines();
        break;
      case "4":
        checkTimes();
        break;
      case "5":
        servePatient();
        break;
      case "6":
        console.log("Encerrando o sistema.");
        return;
      default:
        console.log("Opção inválida.");
    }
  }
}

menu();