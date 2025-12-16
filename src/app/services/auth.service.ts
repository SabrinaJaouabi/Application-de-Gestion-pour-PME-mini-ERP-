import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:8081/api/auth';

  // On garde les infos de l'utilisateur ici
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Important : on charge les infos au démarrage (si refresh page)
    this.loadUserFromStorage();
  }

 login(credentials: { username: string; password: string }): Observable<any> {
  return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
    map(res => {
      if (res && res.token) {
        localStorage.setItem('token', res.token);

        // 1. Décoder le token
        const payload = this.decodeToken(res.token);

        // 2. Extraire les infos du payload
        const username = payload.sub || payload.username || credentials.username;
        
        // ← NOUVEAU : Récupérer l'ID depuis le token (très fréquent : "userId", "id", ou "sub")
        let userId: number | null = null;
        if (payload.userId) userId = Number(payload.userId);
        else if (payload.id) userId = Number(payload.id);
        else if (payload.sub && !isNaN(Number(payload.sub))) userId = Number(payload.sub);

        // 3. Récupérer le rôle
        let role = 'ROLE_USER';
        if (payload.role) role = payload.role;
        else if (payload.roles?.length > 0) role = payload.roles[0];
        else if (payload.authorities?.length > 0) role = payload.authorities[0].authority || payload.authorities[0];
        else if (payload.scope) role = payload.scope.includes('ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';

        // 4. Créer l'objet user COMPLET avec l'ID
        const user = { 
          id: userId,        // ← IMPORTANT : on ajoute l'id
          username, 
          role 
        };

        // 5. Sauvegarde
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);

        console.log('Utilisateur connecté :', user); // Tu verras l'id ici
      }
      return res;
    })
  );
}
  // Méthode pour décoder le token
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Erreur décodage token');
      return {};
    }
  }

  // Charge les infos au démarrage de l'app
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }

  getUsername(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.username : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  register(userData: any) {
    return this.http.post(`${this.API_URL}/register`, userData);
  }


// Ajoute ces méthodes publiques
getCurrentUser(): any {
  return this.currentUserSubject.value;
}

getCurrentUserId(): number | null {
  const user = this.currentUserSubject.value;
  return user?.id ? Number(user.id) : null;
}

getCurrentUsername(): string | null {
  const user = this.currentUserSubject.value;
  return user?.username || null;
}

getCurrentRole(): string | null {
  const user = this.currentUserSubject.value;
  return user?.role || null;
}
getUser() {
  const userString = localStorage.getItem('user');
  if (!userString) return null;
  return JSON.parse(userString);
}

}