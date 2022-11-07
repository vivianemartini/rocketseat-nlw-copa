import { FastifyRequest } from "fastify";

export async function authenticate(reuqest: FastifyRequest){
    await reuqest.jwtVerify()
}