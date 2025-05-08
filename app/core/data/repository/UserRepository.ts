// src/core/data/repositories/UserRepository.ts
import { User } from '@/app/core/domain/entities/User';
import { IUserRepository } from '@/app/core/domain/repositories/IUserRepository';
import localStorage from '../datasources/local/LocalStorage';
import apiClient from '../datasources/remote/ApiClient';

export class UserRepository implements IUserRepository {
  private static instance: UserRepository;

  private constructor() {}

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      // First try to get from local cache
      const cachedUser = await localStorage.getItem<User>(`user_${id}`);
      if (cachedUser) {
        return cachedUser;
      }

      // If not in cache, fetch from API
      const response = await apiClient.get<User>(`/users/${id}`);
      
      if (response.data) {
        // Cache the result
        await localStorage.setItem(`user_${id}`, response.data);
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/users/${user.id}`, user);
      
      if (response.data) {
        // Update the cache
        await localStorage.setItem(`user_${user.id}`, response.data);
        return response.data;
      }
      
      throw new Error(response.error || 'Failed to update user');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      
      if (response.status >= 200 && response.status < 300) {
        // Remove from cache
        await localStorage.removeItem(`user_${id}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await apiClient.get<User[]>(`/users?email=${email}`);
      
      if (response.data && response.data.length > 0) {
        const user = response.data[0];
        // Cache the result
        await localStorage.setItem(`user_${user.id}`, user);
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  }
}

export default UserRepository.getInstance();