import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * `UpdateUserDto` eredita tutte le proprietà di `CreateUserDto` rendendole
 * opzionali, grazie a `PartialType` di @nestjs/swagger.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}