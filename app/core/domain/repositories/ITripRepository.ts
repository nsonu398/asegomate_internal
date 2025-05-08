// src/core/domain/repositories/ITripRepository.ts
import { Trip } from '../entities/Trip';

export interface ITripRepository {
  createTrip(trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip>;
  getTripById(id: string): Promise<Trip | null>;
  getTripsByUserId(userId: string): Promise<Trip[]>;
  updateTrip(trip: Trip): Promise<Trip>;
  deleteTrip(id: string): Promise<boolean>;
}