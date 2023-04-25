import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/interfaces/interfaces';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  posts: Post[] = [];

  estadoInfiniteScroll = false;

  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this.scroll();
    this.postsService.nuevoPost.subscribe(post => {
      this.posts.unshift(post);
    });
  }

  // FUNCIÓN DEL REFRESHER
  refresh(event: any) {
    this.scroll(event, true);
    this.posts = [];
    this.estadoInfiniteScroll = false;
  }

  // FUNCIÓN DEL INFINITE SCROLL
  scroll(event?: any, pull: boolean = false) {

    this.postsService.getPosts(pull)
      .subscribe(resp => {
      console.log(resp);
      this.posts.push(...resp.posts);
      
      if(event) {
        event.target.complete();
        if(resp.posts.length === 0) {
          this.estadoInfiniteScroll = true;
          console.log('Todos los posts se han cargado');
        }
      }
    })
  }

}
