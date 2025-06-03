import { IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateRequestDto {
  @IsDateString()
  dateStart: string;

  @IsDateString()
  dateEnd: string;

  @IsUUID()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  motivation: string;
}