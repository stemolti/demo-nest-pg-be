
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../api/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../api/users/entities/user.entity';
import { CreateUserDto } from '../api/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida le credenziali dell'utente.
   */
  private async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenziali non valide');
    return user;
  }

  /**
   * Login: restituisce token JWT e dati utente (senza password)
   */
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    const { password: _pwd, ...userSafe } = user;
    return { access_token, user: userSafe };
  }

  /**
   * Registrazione tramite AuthService (se si preferisce non usare UsersController.register)
   */
  async register(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    // login immediato per restituire il token
    return this.login(user.email, dto.password);
  }
}