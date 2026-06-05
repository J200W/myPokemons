import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs';
import { User } from '../donnees/user';
import { SupabaseService } from './supabase.service';

const SESSION_KEY = 'mypokemons_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private supabaseService: SupabaseService) {
        this.initSession();
    }

    private initSession() {
        const stored = localStorage.getItem(SESSION_KEY);
        if (!stored) {
            return;
        }

        try {
            const user = this.mapUser(JSON.parse(stored));
            this.currentUserSubject.next(user);
        } catch {
            localStorage.removeItem(SESSION_KEY);
        }
    }

    private saveSession(user: User) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            id: user.id,
            email: user.email,
            username: user.username,
            created_at: user.createdAt,
        }));
    }

    getUserId(): string | null {
        return this.currentUserSubject.value?.id ?? null;
    }

    isLoggedIn(): boolean {
        return this.currentUserSubject.value !== null;
    }

    private mapUser(row: any): User {
        const user = new User();
        user.id = row.id;
        user.email = row.email;
        user.username = row.username;
        user.createdAt = new Date(row.created_at);
        return user;
    }

    private validatePassword(password: string): string | null {
        if (!password || password.trim().length < 6) {
            return 'Le mot de passe est obligatoire (6 caractères minimum).';
        }
        return null;
    }

    private setCurrentUser(user: User) {
        this.currentUserSubject.next(user);
        this.saveSession(user);
    }

    register(email: string, password: string, username: string): Observable<string | null> {
        const passwordError = this.validatePassword(password);
        if (passwordError) {
            return of(passwordError);
        }

        return from(
            this.supabaseService.getClient().rpc('register_user', {
                p_email: email,
                p_password: password,
                p_username: username,
            })
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                    throw error;
                }
                this.setCurrentUser(this.mapUser(data));
                return null;
            }),
            catchError((error) => {
                console.log('register failed', error);
                if (error.code === '23505') {
                    return of('Cet email est déjà utilisé.');
                }
                return of(error.message ?? 'Erreur lors de l\'inscription');
            })
        );
    }

    login(email: string, password: string): Observable<string | null> {
        const passwordError = this.validatePassword(password);
        if (passwordError) {
            return of(passwordError);
        }

        return from(
            this.supabaseService.getClient().rpc('login_user', {
                p_email: email,
                p_password: password,
            })
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                    throw error;
                }
                this.setCurrentUser(this.mapUser(data));
                return null;
            }),
            catchError((error) => {
                console.log('login failed', error);
                return of(error.message ?? 'Erreur de connexion');
            })
        );
    }

    logout(): Observable<void> {
        localStorage.removeItem(SESSION_KEY);
        this.currentUserSubject.next(null);
        return of(undefined);
    }
}
