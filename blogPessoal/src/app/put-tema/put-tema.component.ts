import { ActivatedRoute, Router } from '@angular/router';
import { TemaService } from './../service/tema.service';
import { Component, OnInit } from '@angular/core';
import { Tema } from '../model/tema';

@Component({
  selector: 'app-put-tema',
  templateUrl: './put-tema.component.html',
  styleUrls: ['./put-tema.component.css']
})
export class PutTemaComponent implements OnInit {
  tema: Tema = new Tema()

  

  constructor(
    private temaService: TemaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(){
    window.scroll(0,0)
    let id: number = this.route.snapshot.params["id"];
    this.findByIdTema(id);
  }

  findByIdTema() {
    this.temaService.getByIdTema(this.tema.id).subscribe((resp: Tema) =>{
      this.tema = resp;
    })
  }

  salvar(){
    this.temaService.putTema(this.tema).subscribe((resp:Tema) => {
      this.tema = resp
      this.router.navigate(['/cadastro-tema'])
      alert('Tema atualizado com sucesso!')
    })
  }

}
