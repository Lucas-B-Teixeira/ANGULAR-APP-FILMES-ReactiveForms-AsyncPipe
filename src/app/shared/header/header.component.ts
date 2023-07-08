import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  constructor(private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    let community = <HTMLElement> document.querySelector(".header__list__community")
    let favorites = <HTMLElement> document.querySelector(".header__list__favorites")
    let watched = <HTMLElement> document.querySelector(".header__list__watched")

    if(this.router.url == "/community"){
      community.style.color = 'rgb(255, 209, 2)';
      favorites.style.color = 'white';
      watched.style.color = 'white';
    }
    if(this.router.url == "/favorites"){
      favorites.style.color = 'rgb(255, 209, 2)';
      community.style.color = 'white';
      watched.style.color = 'white';
    }
    if(this.router.url == "/watched"){
      watched.style.color = 'rgb(255, 209, 2)';
      community.style.color = 'white';
      favorites.style.color = 'white';
    }
  }

}
