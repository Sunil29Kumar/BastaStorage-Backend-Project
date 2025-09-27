import { z } from "zod/v4"


export const loginSchema = z.object({
    email: z.email("Enter valid Email"),
    password: z.string().min(3, "Password Not Match"),
})

export const registerSchema = loginSchema.extend({
    name: z.string().min(3, "Name Must contain minimun 3 character").max(255),
    otp: z.string("OTP in Not Valid").length(4, "expected OTP to have 4 characters")
})

export const updateUserRoleSchema = z.object({
  userId: z.string().min(1, "UserId is required"),
  newRole: z.enum(["user", "manager", "admin"], {
    errorMap: () => ({ message: "Role must be user, manager, or admin" })
  })
});