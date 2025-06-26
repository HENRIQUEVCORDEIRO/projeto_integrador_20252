let patientCounter = 1;

export function generateId(): string {
  const id = patientCounter.toString().padStart(3, "0");
  patientCounter++;
  if (patientCounter > 200) patientCounter = 1;
  return id;
}