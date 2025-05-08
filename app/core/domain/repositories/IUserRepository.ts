// src/core/domain/repositories/IUserRepository.ts
import { User } from '../entities/User';

export interface IUserRepository {
  getUserById(id: string): Promise<User | null>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
  getUserByEmail(email: string): Promise<User | null>;
}