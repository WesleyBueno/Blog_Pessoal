
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Postagem } from '../model/postagem';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PostagemService {

  constructor( private http: HttpClient ) { }
  token={headers: new HttpHeaders().set('authorization',environment.token)}

  getAllPostagens():Observable<Postagem[]>{
    return this.http.get<Postagem[]>('http://localhost:8080/postagens',this.token)
  }
  getByIdPostagem(id: number):Observable<Postagem>{
    return this.http.get<Postagem>(`http://localhost:8080/postagens/${id}`,this.token)
  }

  postPostagem(postagem: Postagem):Observable<Postagem>{
    return this.http.post<Postagem>('http://localhost:8080/postagens', postagem, this.token)
  }


  putPostagem(postagem: Postagem): Observable<Postagem> {
    return this.http.put<Postagem>('http://localhost:8080/postagens', postagem, this.token)
  }

  deletePostagem(id: number): Observable<Postagem> {
    return this.http.delete<Postagem>(`http://localhost:8080/postagens/${id}`, this.token)
  }

  getByTituloPostagem(titulo: string): Observable<Postagem[]> {
    return this.http.get<Postagem[]>(`http://localhost:8080/postagens/titulo/${titulo}`, this.token)
  }

}
