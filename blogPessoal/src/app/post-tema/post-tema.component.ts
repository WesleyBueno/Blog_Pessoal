import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { Tema } from '../model/tema';
import { TemaService } from '../service/tema.service';

@Component({
  selector: 'app-post-tema',
  templateUrl: './post-tema.component.html',
  styleUrls: ['./post-tema.component.css']
})
export class PostTemaComponent implements OnInit {

  tema: Tema = new Tema()
  listaTemas!: Tema[]

  constructor(
    private temaService : TemaService, 
    private router : Router
  ) { }

  ngOnInit() {
    this.findAllTemas()
  }

  findAllTemas(){
    this.temaService.getAllTemas().subscribe((resp: Tema[]) =>{
      this.listaTemas = resp
    })
  }

  findByIdTema() {
    this.temaService.getByIdTema(this.tema.id).subscribe((resp: Tema) =>{
      this.tema = resp;
    })

    
  }

  cadastrar(){
    if(this.tema.descricao == null){
      alert('Preencha o campo')
    } else {
      this.temaService.postTema(this.tema).subscribe((resp: Tema) =>{
        this.tema = resp
        this.router.navigate(['/feed'])
        alert('Tema cadastrado com sucesso!')
      })
    }
  }

}
