import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/interfaces/interfaces';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {

  esFavorito: boolean = false;

  @Input() post: Post = {};

  blockSlide = {
    allowSlideNext: false,
    allowSlidePrev: false
  }

  constructor(private storage: StorageService) { }

  ngOnInit() {
    this.esFavorito = this.storage.getFavorito();
  }

  favorito() {
    this.storage.cambiaFavorito();
    this.esFavorito = this.storage.getFavorito();
    this.storage.guardarPostFavorito(this.post);
  }

}
