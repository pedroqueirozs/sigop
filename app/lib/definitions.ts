import { z } from "zod"

export const LoginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }).trim(),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
})

export type LoginFormState =
  | { errors?: { email?: string[]; password?: string[] }; message?: string }
  | undefined

export const CadastroSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }).trim(),
  email: z.string().email({ message: "E-mail inválido" }).trim(),
  cpf: z
    .string()
    .regex(/^\d{11}$/, { message: "CPF deve conter exatamente 11 dígitos numéricos" }),
  matricula: z.string().optional(),
  telefone: z.string().optional(),
  idTipoUsuario: z.coerce.number({ message: "Selecione o tipo de usuário" }).min(1),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

export type CadastroFormState =
  | {
      errors?: {
        nome?: string[]
        email?: string[]
        cpf?: string[]
        matricula?: string[]
        telefone?: string[]
        idTipoUsuario?: string[]
        password?: string[]
        confirmPassword?: string[]
      }
      message?: string
    }
  | undefined
