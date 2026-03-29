


interface IEncryptor {
    encrypt(text: string): Promise<string>,
    compare(cryptedText: string, text: string): Promise<boolean>
}

export {IEncryptor};