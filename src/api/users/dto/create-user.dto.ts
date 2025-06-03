import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  /**
   * La logica di complessità (caratteri speciali, numeri, ecc.) può essere
   * gestita con una `@Matches` opzionale per evitare password deboli.
   */
  password: string;
}