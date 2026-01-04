import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
    },
});

export const sendMail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: `"BastaStorage" <${process.env.USER_EMAIL}>`,
            to,
            subject,
            html,
        });
    } catch (err) {
        console.error("Mail error:", err.message);
    }
};
