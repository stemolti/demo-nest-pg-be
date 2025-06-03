import { UserRole } from '../../api/users/entities/user.entity';

/**
 * Struttura del payload decodificato dal token JWT.
 * `sub` rappresenta l'ID univoco dell'utente.
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  /**
   * Timestamp di rilascio (generato automaticamente da JWT).
   */
  iat?: number;
  /**
   * Timestamp di scadenza (generato automaticamente da JWT).
   */
  exp?: number;
}