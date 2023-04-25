import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

import SwiperCore, { SwiperOptions, Pagination } from 'swiper';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss'],
})
export class AvatarSelectorComponent implements OnInit {

  @Output() avatarSeleccionado = new EventEmitter<string>();
  @Input() avatarActual?: string = 'av-luffy.png';

  avatars = [
    {
      img: 'av-luffy.png',
      seleccionado: true
    },
    {
      img: 'av-zoro.png',
      seleccionado: false
    },
    {
      img: 'av-nami.png',
      seleccionado: false
    },
    {
      img: 'av-usopp.png',
      seleccionado: false
    },
    {
      img: 'av-sanji.png',
      seleccionado: false
    },
    {
      img: 'av-chopper.png',
      seleccionado: false
    },
    {
      img: 'av-robin.png',
      seleccionado: false
    },
    {
      img: 'av-franky.png',
      seleccionado: false
    },
    {
      img: 'av-brook.png',
      seleccionado: false
    }
  ];

  avatarSlide = {
    slidesPerView: 3.5
  };

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.avatars.forEach(avatar => avatar.seleccionado = false);
    for(const avatar of this.avatars) {
      if(avatar.img === this.avatarActual) {
        avatar.seleccionado = true;
        break;
      }
    }
  }

  seleccionarAvatar(avatar: any) {
    this.avatars.forEach(av => av.seleccionado = false);
    avatar.seleccionado = true;

    this.avatarSeleccionado.emit(avatar.img);
  }

}
