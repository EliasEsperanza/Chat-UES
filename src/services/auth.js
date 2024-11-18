import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                reject(new Error("Token inválido."));
            } else {
                resolve(decoded);
            }
        });
    });
}