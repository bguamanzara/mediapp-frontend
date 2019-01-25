import { Component, OnInit } from '@angular/core';
import { TOKEN_NAME } from 'src/app/_shared/var.constant';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  nombreUsuario: string;
  rolesUsuario = [];

  constructor() { }

  ngOnInit() {
    const helper = new JwtHelperService();

    let tk = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
    const decodedToken = helper.decodeToken(tk.access_token);

    this.nombreUsuario = decodedToken.user_name;
    this.rolesUsuario = decodedToken.authorities;

  }

}
