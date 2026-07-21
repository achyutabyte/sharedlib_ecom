//import jwt express response next function

import * as JWT from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "./error_handler";
import { config } from "winston";

const tokens: string[] = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];

export function verifyGatewayRequest(req: Request, res: Response, next: NextFunction): void {

    const authHeader = req.headers?.gatewayToken;

    if (!authHeader) {
        throw new NotAuthorizedError('Invalide request', 'verifyGatewayRequest() method:Request not coming from API Gateway')
    }
    const token: string = req.headers.gatewayToken as string;
    if (!token) {
        throw new NotAuthorizedError('Invalide request', 'verifyGatewayRequest() method:Request not coming from API Gateway')
    }

    try {
        const payload: { id: string; iat: number } = JWT.verify(token, '') as { id: string; iat: number }
        if (!tokens.includes(payload.id)) {
            throw new NotAuthorizedError('Invalid request', 'verifyGatewayRequest() method:Invalid request')
        }
    } catch (error) {
        throw new NotAuthorizedError('Invalide request', 'verifyGatewayRequest() method:Invalid request')
    }

}