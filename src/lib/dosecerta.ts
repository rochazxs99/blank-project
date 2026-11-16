import { z } from "zod";

export const warning =
  "Versão de demonstração. Não utilize para armazenar dados reais de saúde ou de pacientes. Para uso operacional, configure autenticação, controle de acesso e banco de dados seguro com políticas de proteção de dados.";
export const storageKey = "dosecerta-demo-v1";
export const frequencies = ["Semanal", "Mensal", "Trimestral"] as const;
export type Frequency = (typeof frequencies)[number];
export function today() {
  return dateKey(new Date());
}
export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function parseDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  if (y === undefined || m === undefined || d === undefined) return new Date(NaN);
  return new Date(y, m - 1, d, 12);
}
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Selecione uma data válida.")
  .refine((v) => dateKey(parseDate(v)) === v, "Selecione uma data válida.");
export const patientSchema = z.object({
  name: z.string().trim().min(3, "Informe o nome completo (mínimo de 3 caracteres).").max(100),
  phone: z
    .string()
    .trim()
    .max(25)
    .refine((v) => !v || /^[\d\s()+-]{8,25}$/.test(v), "Informe um telefone válido."),
  birth: z
    .union([z.literal(""), dateSchema])
    .refine((v) => !v || v <= today(), "O nascimento não pode ser no futuro."),
  notes: z.string().trim().max(1000),
});
export const treatmentSchema = z.object({
  patientId: z.string().min(1, "Selecione um paciente."),
  medicine: z.string().trim().min(2, "Informe o nome do medicamento.").max(100),
  last: dateSchema.refine((v) => v <= today(), "A última aplicação não pode estar no futuro."),
  frequency: z.enum(frequencies),
  notes: z.string().trim().max(1000),
  active: z.boolean(),
});
export const applicationSchema = dateSchema.refine(
  (v) => v <= today(),
  "Não é possível registrar uma aplicação futura.",
);
const patientRecord = patientSchema.extend({ id: z.string(), demo: z.boolean() });
const treatmentRecord = treatmentSchema.extend({ id: z.string(), demo: z.boolean() });
const historyRecord = z.object({
  id: z.string(),
  treatmentId: z.string(),
  date: dateSchema,
  notes: z.string().max(1000),
  demo: z.boolean(),
});
export const storeSchema = z
  .object({
    patients: z.array(patientRecord),
    treatments: z.array(treatmentRecord),
    history: z.array(historyRecord),
  })
  .refine(
    (s) =>
      s.treatments.every((t) => s.patients.some((p) => p.id === t.patientId)) &&
      s.history.every((h) => s.treatments.some((t) => t.id === h.treatmentId)),
    "Dados vinculados inválidos.",
  );
export type Patient = z.infer<typeof patientRecord>;
export type Treatment = z.infer<typeof treatmentRecord>;
export type Application = z.infer<typeof historyRecord>;
export type Store = z.infer<typeof storeSchema>;
export function nextDate(last: string, frequency: Frequency) {
  const date = parseDate(last);
  if (frequency === "Semanal") {
    date.setDate(date.getDate() + 7);
    return dateKey(date);
  }
  const months = frequency === "Mensal" ? 1 : 3;
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, lastDay));
  return dateKey(date);
}
export function daysBetween(a: string, b: string) {
  const x = parseDate(a),
    y = parseDate(b);
  return Math.round(
    (Date.UTC(y.getFullYear(), y.getMonth(), y.getDate()) -
      Date.UTC(x.getFullYear(), x.getMonth(), x.getDate())) /
      86400000,
  );
}
export function doseStatus(next: string, current = today()) {
  const days = daysBetween(current, next);
  return days < 0 ? "Atrasada" : days <= 7 ? "Próxima" : "Em dia";
}
export function displayDate(value: string) {
  return parseDate(value)
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
    .replaceAll(".", "");
}
export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? ""}${parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : ""}`.toUpperCase();
}
export function makeDemo(current = today()): Store {
  const shift = (n: number) => {
    const d = parseDate(current);
    d.setDate(d.getDate() + n);
    return dateKey(d);
  };
  const demoPatients = [
    ["p1", "Helena Martins", "(11) 90000-0001", "1986-05-12"],
    ["p2", "Antônio Ribeiro", "(11) 90000-0002", "1968-08-23"],
    ["p3", "Clara Oliveira", "(11) 90000-0003", "1995-02-18"],
    ["p4", "Roberto Almeida", "(11) 90000-0004", "1974-11-09"],
    ["p5", "Luiza Ferreira", "(11) 90000-0005", "1990-07-06"],
    ["p6", "Pedro Santos", "(11) 90000-0006", "1982-03-21"],
    ["p7", "Beatriz Costa", "(11) 90000-0007", "1998-09-14"],
    ["p8", "Miguel Lima", "(11) 90000-0008", "1978-01-30"],
  ] satisfies [string, string, string, string][];
  const patients: Patient[] = demoPatients.map(([id, name, phone, birth]) => ({
    id,
    name,
    phone,
    birth,
    notes: "Paciente fictício para demonstração.",
    demo: true,
  }));
  const treatments: Treatment[] = [
    {
      id: "t1",
      patientId: "p1",
      medicine: "Medicamento exemplo A",
      last: shift(-7),
      frequency: "Semanal",
      notes: "Registro fictício. Sem orientação clínica.",
      active: true,
      demo: true,
    },
    {
      id: "t2",
      patientId: "p2",
      medicine: "Medicamento exemplo B",
      last: shift(-6),
      frequency: "Semanal",
      notes: "",
      active: true,
      demo: true,
    },
    {
      id: "t3",
      patientId: "p3",
      medicine: "Medicamento exemplo C",
      last: shift(-5),
      frequency: "Semanal",
      notes: "",
      active: true,
      demo: true,
    },
    {
      id: "t4",
      patientId: "p4",
      medicine: "Medicamento exemplo A",
      last: shift(-3),
      frequency: "Semanal",
      notes: "",
      active: true,
      demo: true,
    },
    {
      id: "t5",
      patientId: "p5",
      medicine: "Medicamento exemplo D",
      last: shift(-1),
      frequency: "Semanal",
      notes: "",
      active: true,
      demo: true,
    },
    {
      id: "t6",
      patientId: "p6",
      medicine: "Medicamento exemplo B",
      last: shift(-10),
      frequency: "Semanal",
      notes: "",
      active: true,
      demo: true,
    },
    {
      id: "t7",
      patientId: "p7",
      medicine: "Medicamento exemplo C",
      last: shift(-12),
      frequency: "Semanal",
      notes: "",
      active: true,
      demo: true,
    },
    {
      id: "t8",
      patientId: "p8",
      medicine: "Medicamento exemplo D",
      last: shift(-10),
      frequency: "Mensal",
      notes: "",
      active: true,
      demo: true,
    },
    {
      id: "t9",
      patientId: "p3",
      medicine: "Medicamento exemplo B",
      last: shift(-20),
      frequency: "Trimestral",
      notes: "",
      active: false,
      demo: true,
    },
  ];
  return {
    patients,
    treatments,
    history: treatments.flatMap((t) => [
      {
        id: `h-${t.id}-1`,
        treatmentId: t.id,
        date: shift(-45),
        notes: "Registro de demonstração.",
        demo: true,
      },
      {
        id: `h-${t.id}-2`,
        treatmentId: t.id,
        date: t.last,
        notes: "Registro de demonstração.",
        demo: true,
      },
    ]),
  };
}
export function recordApplication(
  store: Store,
  treatmentId: string,
  date: string,
  notes: string,
  id: string,
): Store {
  applicationSchema.parse(date);
  const treatment = store.treatments.find((t) => t.id === treatmentId);
  if (!treatment || !treatment.active) throw new Error("Acompanhamento não está ativo.");
  if (date < treatment.last)
    throw new Error("A data deve ser igual ou posterior à última aplicação.");
  if (store.history.some((h) => h.treatmentId === treatmentId && h.date === date))
    throw new Error("Já existe uma aplicação registrada nesta data.");
  return {
    ...store,
    treatments: store.treatments.map((t) => (t.id === treatmentId ? { ...t, last: date } : t)),
    history: [
      ...store.history,
      {
        id,
        treatmentId,
        date,
        notes: z.string().trim().max(1000).parse(notes),
        demo: treatment.demo,
      },
    ],
  };
}
export function deletePatient(store: Store, id: string): Store {
  const ids = store.treatments.filter((t) => t.patientId === id).map((t) => t.id);
  return {
    patients: store.patients.filter((p) => p.id !== id),
    treatments: store.treatments.filter((t) => t.patientId !== id),
    history: store.history.filter((h) => !ids.includes(h.treatmentId)),
  };
}
export function clearDemo(store: Store): Store {
  const patients = store.patients.filter((p) => !p.demo);
  const treatments = store.treatments.filter(
    (t) => !t.demo && patients.some((p) => p.id === t.patientId),
  );
  return {
    patients,
    treatments,
    history: store.history.filter((h) => !h.demo && treatments.some((t) => t.id === h.treatmentId)),
  };
}
