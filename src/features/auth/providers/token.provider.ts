import jwt from "jsonwebtoken";
import {ITokenProvider} from "../interfaces/ITokenProvider";
import { ValidationError } from "../../../common/utils/errors/ValidationError";
import { Injectable } from "@nestjs/common";

@Injectable()
class JWTProvider implements ITokenProvider {
    generateToken(payload: object, secret: string, expiresIn: number = 1000 ): Promise<string> {
        let token: string = jwt.sign({...payload}, secret, {expiresIn});
        return Promise.resolve(token);
    }

    verifyToken(token: string, secret: string): Promise<object> {
        try {
            const decoded: object = jwt.verify(token, secret) as object;
            return Promise.resolve(decoded);   
        } catch (error) {
            let err = error as Error;
            throw new ValidationError(err.message);
        }
        
    }
}

export default JWTProvider;