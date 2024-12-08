import NextAuth from "next-auth";
import Google from "next-auth/providers/google";


export const authOption = {
    providers:[
        Google({
            clientId:process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    secret:process.env.JWT_SECRET as string
}

export default NextAuth(authOption)