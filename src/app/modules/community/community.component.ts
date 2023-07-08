import { Component, OnInit } from '@angular/core';
import{ BehaviorSubject, catchError, combineLatest, debounceTime, distinctUntilChanged, EMPTY, filter, map, Observable, of, startWith, Subscription, tap } from 'rxjs';

import { filme } from 'src/app/core/models/filme.model';
import { FilmesService } from 'src/app/core/services/filmes.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit{

  filmesSubscription: Subscription[] = [];

  filmes$: Observable<filme[]> = this.service.getAll().pipe(
    map(r => r.sort((a,b) => b.avaliationCommunity - a.avaliationCommunity)),
    catchError(e  => {
      swal({
        text: e.status + ' ' + e.statusText + ', Não foi possivel consultar todos os filmes da base de dados!',
        icon: 'error'
      }) 
      return EMPTY
    })
  );

  confirmation: boolean = false

  searchFilme = '';
  arrGenre: string[] = []
  respFilme$ = new BehaviorSubject<string | null>(null)
  respGenre$ = new BehaviorSubject<string[] | null>(null)


  resultFimes$ = combineLatest([
    this.filmes$,
    this.respGenre$.asObservable().pipe(
      startWith(null)
    ),
    this.respFilme$.asObservable().pipe(
      startWith(null),
      distinctUntilChanged(),
      debounceTime(500)
    )
  ]).pipe(
    map(([filmes, respGenre, respFilme])=> {
      if(respGenre){
        filmes = filmes?.filter(f => respGenre.every(g => f.genre.includes(g)))
      }
      if(respFilme){
        filmes = filmes?.filter(f => f.title.toLowerCase().includes(respFilme.toLocaleLowerCase()))
      }
      return filmes
    })
  )

  constructor(private service: FilmesService){}

  ngOnInit(): void {
    
  }

  adicGenre(genre: string, name: string){

    let element = <HTMLButtonElement> document.querySelector('.' + name)
    let colotBtn = getComputedStyle(element).backgroundColor

    if(this.arrGenre.indexOf(genre) == -1){
      this.arrGenre.push(genre)
      this.selectGenre(this.arrGenre)
    }else{
      this.arrGenre.splice(this.arrGenre.indexOf(genre), 1)
      this.selectGenre(this.arrGenre)
    }

    if(colotBtn == 'rgb(10, 40, 61)'){
      element.style.backgroundColor = 'rgb(1, 153, 255)';
    }else{
      element.style.backgroundColor = 'rgb(10, 40, 61)'
    }

  }

  search(title: string){
    this.respFilme$.next(title)
  }

  selectGenre(arrGenre: string[]){
    this.respGenre$.next(arrGenre)
    console.log(this.respGenre$)
  }
 

  del(filme: filme): void{
    swal({
      title: 'Deletar',
      text: 'Deseja realmente excluir o filme ' + filme.title + '?',
      icon: 'info',
      buttons: ['Cancelar', 'Deletar']
    }).then( r => {
      if( r == true){
        this.filmesSubscription.push(this.service.delete(filme.id).subscribe({
          next: () => {
            this.filmes$ = this.filmes$.pipe(
              map(r => r.filter(f => f.id !== filme.id)),
              catchError(e  => {
                swal({
                  text: e.status + ' ' + e.statusText + ', Não foi possivel atualizar a página de forma Assincrona!',
                  icon: 'error'
                }) 
                return EMPTY
              })
            )
            swal({
              text: 'O filme ' + filme.title + 'foi excluído com sucesso!',
              icon: 'success' 
            })
          },
          error: (e) => {
            swal({
              text: e.status + ' ' + e.statusText + ', Não foi possivel excluir o filme ' + filme.title,
              icon: 'error' 
            })
          }
        })
      )}
    })
  }

  addFavortites(filme: filme, id: number): void{

    if(filme.favorites == false){
      swal({
        title: 'Adicionar aos Favoritos!',
        text: 'Deseja Adicionar o filme ' + filme.title + ' ao seus filmes favoritos?',
        icon: 'info',
        buttons: ["Cancelar", "Adicionar"]
      }).then( r => {
        if(r == true){
          filme.favorites = !filme.favorites;
          this.filmesSubscription.push(this.service.update(filme, id).subscribe({
              next: () => {
                if(filme.favorites == true){
                  swal({
                    text: 'O filme ' + filme.title + ", foi adicionado ao seus filmes favoritos",
                    icon: 'success'
                  })
                }
              },
              error: (e) => {
                swal({
                  text: e.status + ' ' + e.statusText + ', Não foi possivel Adicionar o filme  ' + filme.title + ", no seus filmes favoritos",
                  icon: 'error'
                })
              }
            }
          ))
        }
      })
    }
    else{
      swal({
        title: 'Remover dos Favoritos!',
        text: 'Deseja Remover o filme ' + filme.title + ' do seus filmes favoritos?',
        icon: 'info',
        buttons: ["Cancelar", "Remover"]
      }).then( r => {
        if(r == true){
          filme.favorites = !filme.favorites;
          this.filmesSubscription.push(this.service.update(filme, id).subscribe({
              next: () => {
                if(filme.favorites == false){
                  swal({
                    text: 'O filme ' + filme.title + ", foi removido ao seus filmes favoritos",
                    icon: 'success'
                  })
                }
              },
              error: (e) => {
                  swal({
                    text: e.status + ' ' + e.statusText + ', Não foi possivel Remover o filme  ' + filme.title + ", do seus filmes favoritos",
                    icon: 'error'
                  })
              }
            }
          ))
        }
      })
    }

  }

  addWatched(filme: filme, id:number):void{

    if(filme.watched == false){
      swal({
        title: 'Adicionar aos Assistidos!',
        icon: 'info',
        text: 'Deseja adicionar o filme ' + filme.title + ' ao seus filmes assistidos?',
        buttons: ["Cancelar", "Adicionar"]
      }).then(r => {
        if(r == true){
          filme.watched = !filme.watched;
          this.filmesSubscription.push(this.service.update(filme, id).subscribe(
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
          this.filmesSubscription.push(this.service.update(filme, id).subscribe({
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

  edit(filme: filme, id: number){
    filme.enableEdit = !filme.enableEdit;
    if(filme.enableEdit == false){
      swal({
        title: 'Editar o filme ' + filme.title + '!',
        text: 'Deseja salvar as alterações feita no filme ' + filme.title,
        icon: 'info',
        buttons: ['Cancelar', 'Salvar']
      }).then( r => {
        if(r == true){
          this.filmesSubscription.push(this.service.update(filme, id).subscribe({
              next: () => {
                swal({
                  text: 'O filme ' + filme.title + ', foi alterado com sucesso',
                  icon: 'success'
                })
              },
              error: (e) => {
                swal({
                  text: e.status + ' ' + e.statusText + ', Não foi possivel alterar o filme ' + filme.title,
                  icon: 'error'
                })
              }
            })
          )
        }
      })
    }
  }

  ngOnDestroy():void{
    this.filmesSubscription.forEach(s => s.unsubscribe())
  }
}
