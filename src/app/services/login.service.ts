import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import {
    Observable,
    map,
    Subject,
    BehaviorSubject,
    catchError,
    throwError,
    mergeMap,
  } from 'rxjs';
  import { User } from '../interfaces/user';

  
  @Injectable({
    providedIn: 'root',
  })
  export class LoginService {
    userSubject = new Subject<User>();
    logged = new BehaviorSubject<boolean>(false);
  
    private loginURL =
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCP1b9tjxPz73e1lSQmkfQ5GJYJL-P_9Po';
     private registerURL =
       'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCP1b9tjxPz73e1lSQmkfQ5GJYJL-P_9Po';
  
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  
    constructor(private http: HttpClient) {
      this.isLogged() ? this.logged.next(true) : this.logged.next(false);
    }
  
    localstorageLogin(idToken: string, expiresIn: string, localId: string) {
      const now = new Date();
      const Token = {
        token: idToken,
        expiration: now.getTime() + parseInt(expiresIn) * 1000,
      };
      localStorage.setItem('idToken', JSON.stringify(Token));
      localStorage.setItem('localId', localId);
      this.logged.next(true);
    }
  
    login(data: User): Observable<User> {
      let datos = { ...data, returnSecureToken: true };
      return this.http
        .post<{
          email: string;
          idToken: string;
          localId: string;
          expiresIn: string;
        }>(this.loginURL, JSON.stringify(datos), this.httpOptions)
        .pipe(
          map((response) => {
            this.userSubject.next(data);
            this.localstorageLogin(
              response.idToken,
              response.expiresIn,
              response.localId
            );
            return data;
          }),
          catchError((resp: HttpErrorResponse) =>
            throwError(() => new Error(`Error de Login: ${resp.message}`))
          )
        );
    }
  
    register(data: User): Observable<any> {
      let datos = { ...data, returnSecureToken: true };
      return this.http
        .post<{
          email: string;
          idToken: string;
          localId: string;
          expiresIn: string;
        }>(this.registerURL, JSON.stringify(datos), this.httpOptions)
    }
  
    logout() {
      localStorage.removeItem('idToken');
      localStorage.removeItem('localId');
      this.logged.next(false);
    }
  
    isLogged() {
      const idToken = localStorage.getItem('idToken');
      const now = new Date();
      if (idToken) {
        const token: { token: string; expiration: number } = JSON.parse(idToken);
        if (token.expiration > now.getTime()) {
          return true;
        } else {
          localStorage.removeItem('idToken');
          localStorage.removeItem('localId');
          return false;
        }
      } else {
        return false;
      }
    }
  
    getToken(): string | null {
      const idToken = localStorage.getItem('idToken');
      if (idToken) {
        const token: { token: string; expiration: number } = JSON.parse(idToken);
        return token.token;
      } else {
        return null;
      }
    }
  }