import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs';
import { User } from '../donnees/user';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class UsersService {

  constructor(private supabaseService: SupabaseService) {}

  private log(log: string) {
    console.info(log);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private mapUser(row: any): User {
    const user = new User();
    user.id = row.id;
    user.email = row.email;
    user.username = row.username;
    user.createdAt = new Date(row.created_at);
    return user;
  }

  getUsers(): Observable<User[]> {
    return from(
      this.supabaseService.getClient().from('users').select('*').order('username')
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return (data ?? []).map((row) => this.mapUser(row));
      }),
      tap(_ => this.log('fetched users')),
      catchError(this.handleError<User[]>('getUsers', []))
    );
  }
}
