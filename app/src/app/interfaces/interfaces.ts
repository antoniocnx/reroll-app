export interface Usuario {
  _id?: string;
  nombre?: string;
  apellidos?: string;
  email?: string;
  password?: string;
  nacimiento?: Date;
  sexo?: string;
  direccion?: string;
  ciudad?: string;
  localidad?: string;
  pais?: string;
  cp?: number;
  favoritos?: Articulo[];
  avatar?: string;
}

export interface Administrador {
  _id?: string;
  nombre?: string;
  apellidos?: string;
  email?: string;
  password?: string;
  nacimiento?: Date;
  sexo?: string;
  direccion?: string;
  ciudad?: string;
  localidad?: string;
  pais?: string;
  cp?: number;
  avatar?: string;
}

export interface Articulo {
  _id?: string;
  fecha?: Date;
  nombre?: string;
  precio?: Number;
  categoria?: string;
  descripcion?: string;
  localizacion?: string;
  estado?: string;
  envio?: string;
  favorito?: boolean;
  galeria?: string[];
  usuario?: Usuario;
}

export interface LocalFile {
  name: string;
  path: string;
  data: string;
}

export interface RespuestaArticulo {
  ok: boolean;
  pagina: number;
  articulos: Articulo[];
}

export interface RespuestaCrearArticulo {
  ok: boolean;
  articulo: Articulo;
}

export interface Post {
  _id?: string;
  mensaje?: string;
  imgs?: string[];
  coords?: string;
  usuario?: Usuario;
  created?: string;
}

export interface RespuestaPost {
  ok: boolean;
  pagina: number;
  posts: Post[];
}

export interface RespuestaCrearPost {
  ok: boolean;
  post: Post;
}

export interface RespuestaLogin {
  ok: boolean;
  token: string;
}

export interface RespuestaSignUp {
  status: string;
  token: string;
  message?: string;
}

export interface RespuestaUsuario {
  ok: boolean;
  usuario: Usuario;
}

export interface RespuestaAdmin {
  ok: boolean;
  admin: Usuario;
}


export interface RespuestaFavoritos {
  ok: boolean;
  favoritos: Articulo[];
}

export interface ArticuloFavorito {
  ok: boolean;
  mensaje: string;
}
