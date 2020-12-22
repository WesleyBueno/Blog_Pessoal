import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css']
})
export class AlertasComponent implements OnInit {

  @Input()message!: string
  @Input()type = 'success'
  constructor(public modal: BsModalRef) { }

  ngOnInit(): void {
  }

  onClose(){
    this.modal.hide()
  }

}
