import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const url = environment.heroku_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform( img: string, userId: string): string {
    return `${ url }/posts/imagen/${ userId }/${ img }`;
  }

}
