import { UserLogin } from './../model/UserLogin';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  logar(userLogin: UserLogin):Observable<UserLogin>{
    return this.http.post<UserLogin>('http://localhost:8080',userLogin)
  }

  cadastrar(user: User):Observable<User>{
    return this.http.post<User>('http://localhost:8080',user)
  }

  btnSair(){
    let ok = false
    let token = localStorage.getItem('token')

    if(token != null){
      ok = true
    }

    return ok
  }

  btnLogin(){
    let ok = false
    let token = localStorage.getItem('token')

    if(token == null){
      ok = true
    }

    return ok
  }
}

