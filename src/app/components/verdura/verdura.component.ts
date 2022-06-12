import { Component, OnInit } from '@angular/core';
import { Verdura } from 'src/app/interfaces/verdura';
import { VerduraService } from 'src/app/services/verdura.service';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs';

@Component({
  selector: 'app-verdura',
  templateUrl: './verdura.component.html',
  styleUrls: ['./verdura.component.css']
})
export class VerduraComponent implements OnInit {

  url = "https://daw2021-2022-default-rtdb.firebaseio.com/Marcadona/Verdura/";

  

  verduras: Verdura[] = [];

  constructor(private verduraService: VerduraService, private http: HttpClient) { 
  }

  ngOnInit(): void {
    this.getVerdura();
  }

  public getVerdura(){
    this.verduraService.getVerduras().subscribe(s => this.verduras = s);
    console.log(this.verduras);
   
  }

  public getBorrar(id: string){
    this.verduraService.eliminar(id)
  }

  

}
