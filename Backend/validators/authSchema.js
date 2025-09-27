import { z } from "zod/v4"


// Schema for sending OTP
export const sendOtpSchema = z.object({
    email: z.string().email("Invalid email address")
});

// Schema for verifying OTP
export const otpSchema = sendOtpSchema.extend({
    otp: z.string().length(4, "OTP must be exactly 4 characters")
});

export const setGooglePasswordSchema = z.object({
    password: z.string()
    // .regex(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
    //     "Password must have at least 6 characters, one uppercase, one lowercase, one number, and one special character"
    // )
    ,
    confirmPassword: z.string()
    // .regex(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
    //     "Confirm password must follow the same rules"
    // )
})