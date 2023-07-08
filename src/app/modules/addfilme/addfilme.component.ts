import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { FilmesService } from 'src/app/core/services/filmes.service';
import { filme } from 'src/app/core/models/filme.model';
import swal from 'sweetalert';

@Component({
  selector: 'app-addfilme',
  templateUrl: './addfilme.component.html',
  styleUrls: ['./addfilme.component.scss']
})
export class AddfilmeComponent implements OnInit{

  addfilmeSubscription: Subscription [] = []

  urlImage!: String;

  form!: FormGroup;

  postFilme!: filme;

  // radiocontrol: number = 0;


  constructor(private service: FilmesService, private formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.newForm();
  }

  adicImage(): void{
    let image = <HTMLInputElement> document.querySelector(".box__add__form__img__input");
    this.urlImage = image.value;
  }

  newForm(): void{
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      sinopse: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(265)]],
      duration: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(6)]],
      acao: [''],
      aventura: [''],
      crime: [''],
      comedia: [''],
      drama: [''],
      fantasia: [''],
      ficcao: [''],
      guerra: [''],
      luta: [''],
      romance: [''],
      suspense: [''],
      terror: [''],
      saga: [undefined, [Validators.required]],
      date: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
      avaliationCommunity: [undefined, [Validators.required]],
      urlImage: ['', [Validators.required]]
    })
  }

  sendFilme(): void{

    if(this.form.status === "VALID"){
      this.postFilme =  {
        id: Math.floor(Date.now() * Math.random()),
        community: true,
        favorites: false,
        watched: false,
        title: String(this.form.get('title')?.value),
        sinopse: String(this.form.get('sinopse')?.value),
        duration: String(this.form.get('duration')?.value),
        genre: [
              String(this.form.get('acao')?.value),
              String(this.form.get('aventura')?.value),
              String(this.form.get('crime')?.value),
              String(this.form.get('comedia')?.value),
              String(this.form.get('drama')?.value),
              String(this.form.get('fantasia')?.value),
              String(this.form.get('ficcao')?.value),
              String(this.form.get('guerra')?.value),
              String(this.form.get('luta')?.value),
              String(this.form.get('romance')?.value),
              String(this.form.get('suspense')?.value),
              String(this.form.get('terror')?.value)
        ],
        saga: Boolean(this.form.get('saga')?.value),
        date: String(this.form.get('date')?.value),
        avaliationCommunity: Number(this.form.get('avaliationCommunity')?.value),
        avaliationPersonal: 0,
        urlImage: String(this.form.get('urlImage')?.value),
        enableEdit: false
      }

      this.postFilme.genre = this.postFilme.genre.filter(g => g !== '' || null)
  
      this.addfilmeSubscription.push(this.service.add(this.postFilme).subscribe({
          next: () => {
            swal({
              text: 'O filme ' + this.postFilme.title + ' foi adicionado com sucesso!',
              icon: 'success'
            })
          },
          error: (e) => {
            swal({
              text: e.status + ' ' + e.statusText + ', Ocorreu um erro ao adicionar o filme ' + this.postFilme.title,
              icon: 'error'
            })
          }
        }
      ))
  
      this.form.reset()

      // console.log(this.postFilme.genre)
    }
    else{
      swal({
        text: 'O formulário não é valido, por favor, insira as informações corretamente!',
        icon: 'error'
      })
    }
  
  }

  // radioUnchecked(id: string): void{
  //   let btn = <HTMLInputElement> document.getElementById(id)

  //   if((btn.checked == true) && (this.radiocontrol == 1)){
  //     btn.checked = !btn.checked
  //     this.radiocontrol = 0
  //   }else{
  //     this.radiocontrol = 1
  //   }
  // }

  get title(){
    return this.form.get('title')
  }

  get sinopse(){
    return this.form.get('sinopse')
  }

  get duration(){
    return this.form.get('duration')
  }

  get acao(){
    return this.form.get('acao')
  }

  get aventura(){
    return this.form.get('aventura')
  }

  get crime(){
    return this.form.get('crime')
  }

  get comedia(){
    return this.form.get('comedia')
  }

  get drama(){
    return this.form.get('drama')
  }

  get fantasia(){
    return this.form.get('fantasia')
  }

  get ficcao(){
    return this.form.get('ficcao')
  }

  get guerra(){
    return this.form.get('guerra')
  }

  get luta(){
    return this.form.get('luta')
  }

  get romance(){
    return this.form.get('romance')
  }

  get suspense(){
    return this.form.get('suspense')
  }

  get terror(){
    return this.form.get('terror')
  }

  get saga(){
    return this.form.get('saga')
  }

  get date(){
    return this.form.get('date')
  }

  get avaliationCommunity(){
    return this.form.get('avaliationCommunity')
  }

  get url(){
    return this.form.get('urlImage')
  }

  ngOnDestroy():void{
    this.addfilmeSubscription.forEach(s => s.unsubscribe())
  }

}
