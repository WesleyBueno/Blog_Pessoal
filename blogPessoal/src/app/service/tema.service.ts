import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Tema } from '../model/tema';
@Injectable({
  providedIn: 'root'
})
export class TemaService {
  constructor( private http: HttpClient ) { }
  token={headers: new HttpHeaders().set('Authorization',environment.token)}


  getAllTemas():Observable<Tema[]>{
    return this.http.get<Tema[]>('http://localhost:8080/tema',this.token)
  }
  getByNomeTema(nome: string):Observable<Tema[]> {
    return this.http.get<Tema[]>(`http://localhost:8080/tema/nome/${nome}`, this.token)
  }
  postTema(tema: Tema):Observable<Tema>{
    return this.http.post<Tema>('http://localhost:8080/tema',tema, this.token)
  }
  deleteTema(id: number):Observable<Tema> {
    return this.http.delete<Tema>(`http://localhost:8080/tema/${id}`,this.token)
  }
  putTema(tema: Tema):Observable<Tema> {
    return this.http.put<Tema>('http://localhost:8080/tema', tema, this.token)
  }
  getByIdTema(id:number):Observable<Tema>{
    return this.http.get<Tema>(`http://localhost:8080/tema/${id}`,this.token)
  }
}