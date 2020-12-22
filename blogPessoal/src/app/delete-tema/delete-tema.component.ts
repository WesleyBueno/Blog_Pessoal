import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tema } from '../model/tema';
import { AlertasService } from '../service/alertas.service';
import { TemaService } from '../service/tema.service';

@Component({
  selector: 'app-delete-tema',
  templateUrl: './delete-tema.component.html',
  styleUrls: ['./delete-tema.component.css']
})
export class DeleteTemaComponent implements OnInit {

  tema: Tema = new Tema()

  constructor(
    private temaService: TemaService,
    private router: Router,
    private route: ActivatedRoute,
    private alerta: AlertasService
  ) { }

  ngOnInit() {
    window.scroll(0,0)
    let id:number = this.route.snapshot.params["id"]
    this.findByIdTema(id)
  }

  findByIdTema(id:number){
    this.temaService.getByIdTema(id).subscribe((resp: Tema) =>{
      this.tema = resp
    })
  }

  btnSim(){
    this.temaService.deleteTema(this.tema.id).subscribe(() =>{
      this.router.navigate(['/cadastro-tema'])
      this.alerta.showAlertSuccess('Tema apagado com sucesso!')
    })
  }

  btnNao(){
    this.router.navigate(['/cadastro-tema'])
  }

}
