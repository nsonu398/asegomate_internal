// src/core/data/repositories/TripRepository.ts
import { Trip } from '@/app/core/domain/entities/Trip';
import { ITripRepository } from '@/app/core/domain/repositories/ITripRepository';
import localStorage from '../datasources/local/LocalStorage';
import apiClient from '../datasources/remote/ApiClient';

export class TripRepository implements ITripRepository {
  private static instance: TripRepository;

  private constructor() {}

  public static getInstance(): TripRepository {
    if (!TripRepository.instance) {
      TripRepository.instance = new TripRepository();
    }
    return TripRepository.instance;
  }

  async createTrip(tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip> {
    try {
      const response = await apiClient.post<Trip>('/trips', tripData);
      
      if (response.data) {
        // Cache the result
        await localStorage.setItem(`trip_${response.data.id}`, response.data);
        
        // Update user trips list in cache
        const userTripIds = await localStorage.getItem<string[]>(`user_trips_${tripData.userId}`) || [];
        if (!userTripIds.includes(response.data.id)) {
          userTripIds.push(response.data.id);
          await localStorage.setItem(`user_trips_${tripData.userId}`, userTripIds);
        }
        
        return response.data;
      }
      
      throw new Error(response.error || 'Failed to create trip');
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  }

  async getTripById(id: string): Promise<Trip | null> {
    try {
      // First try to get from local cache
      const cachedTrip = await localStorage.getItem<Trip>(`trip_${id}`);
      if (cachedTrip) {
        return cachedTrip;
      }

      // If not in cache, fetch from API
      const response = await apiClient.get<Trip>(`/trips/${id}`);
      
      if (response.data) {
        // Cache the result
        await localStorage.setItem(`trip_${id}`, response.data);
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching trip:', error);
      throw error;
    }
  }

  async getTripsByUserId(userId: string): Promise<Trip[]> {
    try {
      // Check if we have a cached list of trip IDs for this user
      const cachedTripIds = await localStorage.getItem<string[]>(`user_trips_${userId}`);
      
      if (cachedTripIds) {
        // Fetch trips from cache
        const trips: Trip[] = [];
        for (const tripId of cachedTripIds) {
          const trip = await localStorage.getItem<Trip>(`trip_${tripId}`);
          if (trip) {
            trips.push(trip);
          }
        }

        // If we have all the trips in cache, return them
        if (trips.length === cachedTripIds.length) {
          return trips;
        }
      }

      // Otherwise fetch from API
      const response = await apiClient.get<Trip[]>(`/trips?userId=${userId}`);
      
      if (response.data) {
        // Cache the results
        const tripIds: string[] = [];
        for (const trip of response.data) {
          await localStorage.setItem(`trip_${trip.id}`, trip);
          tripIds.push(trip.id);
        }
        await localStorage.setItem(`user_trips_${userId}`, tripIds);
        
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching trips by user ID:', error);
      throw error;
    }
  }

  async updateTrip(trip: Trip): Promise<Trip> {
    try {
      const response = await apiClient.put<Trip>(`/trips/${trip.id}`, trip);
      
      if (response.data) {
        // Update the cache
        await localStorage.setItem(`trip_${trip.id}`, response.data);
        return response.data;
      }
      
      throw new Error(response.error || 'Failed to update trip');
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  }

  async deleteTrip(id: string): Promise<boolean> {
    try {
      const trip = await this.getTripById(id);
      if (!trip) {
        return false;
      }
      
      const response = await apiClient.delete(`/trips/${id}`);
      
      if (response.status >= 200 && response.status < 300) {
        // Remove from cache
        await localStorage.removeItem(`trip_${id}`);
        
        // Update user trips list in cache
        const userTripIds = await localStorage.getItem<string[]>(`user_trips_${trip.userId}`) || [];
        const updatedTripIds = userTripIds.filter(tripId => tripId !== id);
        await localStorage.setItem(`user_trips_${trip.userId}`, updatedTripIds);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  }
}

export default TripRepository.getInstance();