import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from "#prisma/client"

export const JWT_SECRET   = () => process.env.JWT_SECRET!
export const JWT_ISSUER   = () => process.env.API_URL
export const JWT_AUDIENCE = () => process.env.CLIENT_URL

const createPayload = (user: User): JwtPayload => {
    const current_time = Math.floor(Date.now() / 1000)
    const expiration_time = current_time + 864000

    return {
        iss: JWT_ISSUER(),
        aud: JWT_AUDIENCE(),
        sub: user.id,
        exp: expiration_time
    }
}
export const generateAccessToken = (user: User): string => {
    return jwt.sign(createPayload(user), JWT_SECRET(), {
        algorithm: 'HS256'
    })
}
export const validateAccessToken = (token: string): Promise<JwtPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET(), (error, decoded) =>{
            if (error) {
                reject(error)
            }
            else if (decoded && typeof decoded !== 'string') {
                resolve(decoded as JwtPayload)
            }
            else {
                reject(new Error('Invalid token payload'))
            }
        })
    })
}