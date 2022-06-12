import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  formulario!: FormGroup;
  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.formulario = this.fb.group({
      Nom: ['', Validators.required],
      Precio: ['', [Validators.required]],
      message: ['', [Validators.required]],
    });

  }

  onSubmit(formulario: FormGroup) {

    console.log('Valid?', formulario.valid); // true or false
    console.log('Name:', formulario.value.Nom);
    console.log('Precio:', formulario.value.Precio);
    console.log('Message:', formulario.value.message);

    setTimeout(() => {

      const url = `https://daw2021-2022-default-rtdb.firebaseio.com/Marcadona/`;

      fetch(url + formulario.value.message + "/" + formulario.value.Nom + ".json", {

        method: "post",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(formulario.value.Nom)

      }).then((response) => response.json());

    }, 5000);

  }

}