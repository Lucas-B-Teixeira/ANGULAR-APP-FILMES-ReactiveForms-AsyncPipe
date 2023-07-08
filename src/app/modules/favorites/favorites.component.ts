
import { Component, OnInit } from '@angular/core';
import { catchError, EMPTY, map, Observable, Subscription } from 'rxjs'

import { filme } from 'src/app/core/models/filme.model';
import { FilmesService } from 'src/app/core/services/filmes.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit{

  favorites$: Observable<filme[]> = this.service.getAll().pipe(
    map( r => r.filter( f => f.favorites === true).sort((a,b) => b.avaliationCommunity - a.avaliationCommunity)),
    catchError(e  => {
      swal({
        text: e.status + ' ' + e.statusText + ', Não foi possivel consultar os filmes Favoritos!',
        icon: 'error'
      }) 
      return EMPTY
    })
  )

  favoritesSubscription: Subscription[] = [];

  constructor(private service: FilmesService){}

  ngOnInit(): void {

  }


  del(filme: filme, i: number): void{

    swal({
      title: 'Remover dos favoritos',
      text: 'Deseja remover o filme ' + filme.title + ' do seus filmes favoritos?',
      icon: 'info',
      buttons: ['Cancelar', 'Remover']
    }).then(r => {
      if(r == true){
        filme.favorites = !filme.favorites;
        this.favoritesSubscription.push(this.service.update(filme, filme.id).subscribe({
          next: () => {
            this.favorites$ = this.favorites$.pipe(
              map(r => r.filter( f => f.favorites === true)),
              catchError(e  => {
                swal({
                  text: e.status + ' ' + e.statusText + ', Não foi possivel atualizar a página de forma Assincrona!',
                  icon: 'error'
                }) 
                return EMPTY
              })
            )
            swal({
              text: 'O filme ' + filme.title + ", foi removido do seus filmes favoritos",
              icon: 'success'
            })
          },
          error: (e) => {
            swal({
              text: e.status + ' ' + e.statusText + ', Não foi possivel remover o filme  ' + filme.title + ', do seus filmes favoritos',
              icon: 'error'
            })
          }
        }
      ))
      }
    })

  }

  watched(filme: filme){
    if(filme.watched == false){
      swal({
        title: 'Adicionar aos Assistidos!',
        icon: 'info',
        text: 'Deseja adicionar o filme ' + filme.title + ' ao seus filmes assistidos?',
        buttons: ["Cancelar", "Adicionar"]
      }).then(r => {
        if(r == true){
          filme.watched = !filme.watched;
          this.favoritesSubscription.push(this.service.update(filme, filme.id).subscribe(
            {
              next: () => {
                if(filme.watched == true){
                  swal({
                    text: 'O filme ' + filme.title + ", foi ADICIONADO ao seus filmes assistidos",
                    icon: 'success'
                  })
                }
              },
              error: (e) => {
                swal({
                  text: e.status + ' ' + e.statusText + ',  Não foi possivel Adicionar o filme  ' + filme.title + ", no seus filmes assistidos",
                  icon: 'error'
                })
              }
            }) 
          )}
        })    
    }
    else{
      swal({
        title: 'Remover aos Assistidos!',
        icon: 'info',
        text: 'Deseja REMOVER o filme ' + filme.title + ', do seus filmes assistidos',
        buttons: ["Cancelar", "Remover"]
      }).then(r => {
        if(r == true){
          filme.watched = !filme.watched;
          this.favoritesSubscription.push(this.service.update(filme, filme.id).subscribe({
              next: () => {
                if(filme.watched == false){
                  swal({
                    text: 'O filme ' + filme.title + ", foi REMOVIDO ao seus filmes assistidos",
                    icon: 'success'
                  })
                }
              },
              error: (e) => {
                swal({
                  text: e.status + ' ' + e.statusText + ', Não foi possivel Remover o filme  ' + filme.title + ", do seus filmes assistidos",
                  icon: 'error'
                  })
                }
              }
            ))
          }
        })
      }
}

  ngOnDestroy():void{
    this.favoritesSubscription.forEach(s => s.unsubscribe())
  }


}
