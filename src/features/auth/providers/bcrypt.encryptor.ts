import bcrypt from "bcrypt";
import {IEncryptor} from "../interfaces/IEncryptor";
import { EncryptionError } from "../../../common/utils/errors/EncryptionError";
import { Injectable } from "@nestjs/common";

@Injectable()
class BCrypt implements IEncryptor{
    public async encrypt(text: string): Promise<string> {
        try {
            let cryptedText = await bcrypt.hash(text, 10);
            return cryptedText;
        } catch (error) {
            let err = error as Error;
            throw new EncryptionError(err.message)
        }
    }
    public async compare(cryptedText: string, text: string): Promise<boolean> {
        try {
            let isEqual: boolean = await bcrypt.compare(text, cryptedText);
            return isEqual;
        } catch (error) {
            let err = error as Error;
            throw new EncryptionError(err.message)
        }
    }
}

export default BCrypt;