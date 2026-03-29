import { IsEmail, Length, IsString } from "class-validator";

class CreateUserDtoValidator {
    @IsEmail()
    email!: string

    @IsString()
    @Length(8, 250)
    password!: string
}

export default CreateUserDtoValidator;