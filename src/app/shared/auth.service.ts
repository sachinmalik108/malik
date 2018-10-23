import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './interface.service';
import { BehaviorSubject, ReplaySubject, Observable, throwError } from 'rxjs'
import { map, distinctUntilChanged, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();



  constructor(
    private http: HttpClient,
    private router: Router
  ){}
  
  register(user: User) : Observable<User> {
    console.log(user.email)
    return this.http.post
      ("https://conduit.productionready.io/api/users",
      {
        user: user
      })
      .pipe(
        catchError(err => {
          return throwError(err.error)
        }),
        map(data => {
          console.log(data);
          this.setAuth(data["user"])
          return data;
        })
      )
      
  }

  login(user: User) :Observable<User> {
    console.log(user.email)
    return this.http.post
      ("https://conduit.productionready.io/api/users/login",
      {
        user: user
      })
      .pipe(
        map(data => {
          console.log(data);
          this.setAuth(data["user"])
          return data;
        })
      )
  }

  getUser() {
    this.http.get("https://conduit.productionready.io/api/user", this.addHeader())
      .subscribe(
        (response) => {
          console.log(response);
          this.setAuth(response["user"])
        },
        (error) => {
          console.log(error);
          this.logout();
        }
      )

  }

  addHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem("jwt")
      })
    };
    return httpOptions;
  }

  checkAuth() {
    console.log(localStorage.getItem("jwt"))
    if (localStorage.getItem("jwt")) {
      this.getUser();
    } else {
      this.logout();
    }
  }

  setAuth(user: User) {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem("jwt", user.token);
  }

  logout() {
    console.log("logout")
    this.currentUserSubject.next({} as User);
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem("jwt");
    this.router.navigate([''])
  }
}



