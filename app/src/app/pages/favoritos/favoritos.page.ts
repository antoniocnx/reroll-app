import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/interfaces/interfaces';
import { PostsService } from 'src/app/services/posts.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  postsFavoritos: Post[] = [];

  esFavorito: boolean = false;

  estadoInfiniteScroll = false;

  constructor(private storage: StorageService,
              private postsService: PostsService) { }

  ngOnInit() {
    this.postsFavoritos = this.storage.postsFavoritos;
    this.esFavorito = this.storage.getFavorito();
    console.log(this.postsFavoritos);
  }

    // FUNCIÓN DEL REFRESHER
    refresh(event: any) {
      this.scroll(event, true);
      this.postsFavoritos = [];
      this.estadoInfiniteScroll = false;
    }
  
    // FUNCIÓN DEL INFINITE SCROLL
    scroll(event?: any, pull: boolean = false) {
  
      this.postsService.getPosts(pull)
        .subscribe(resp => {
        console.log(resp);
        this.postsFavoritos.push(...resp.posts);
        
        if(event) {
          event.target.complete();
          if(resp.posts.length === 0) {
            this.estadoInfiniteScroll = true;
            console.log('Todos los posts favoritos se han cargado');
          }
        }
      })
    }

}
