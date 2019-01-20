import { map } from 'rxjs/operators';
import { Menu } from './../_model/menu';
import { MenuService } from './menu.service';
import { TOKEN_NAME } from './../_shared/var.constant';
import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(private router: Router, private loginService: LoginService, private menuService: MenuService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const helper = new JwtHelperService();

    let rpta = this.loginService.estaLogeado();

    if (!rpta) {
      sessionStorage.clear();
      this.router.navigate(['login']);
      return false;
    } else {
      let token = JSON.parse(sessionStorage.getItem(TOKEN_NAME));

      if (!helper.isTokenExpired(token.access_token)) {
        const decodedToken = helper.decodeToken(token.access_token);
        let url = state.url; // /plato

        return this.menuService.listarPorUsuario(decodedToken.user_name).pipe(map((data: Menu[]) => {
          this.menuService.menuCambio.next(data);

          let cont = 0;
          for (let m of data) {
            if (m.url === url || "/perfil" === url ) {
              cont++;
              break;
            }
          }

          if (cont > 0) {
            return true;
          } else {
            this.router.navigate(['not-403']);
            return false;
          }
        }));
      } else {
        sessionStorage.clear();
        this.router.navigate(['login']);
        return false;
      }
    }
  }
}
