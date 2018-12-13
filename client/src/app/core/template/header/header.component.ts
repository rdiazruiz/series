import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/home/home.service';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  subscription;
  serie;
  user;
  constructor(private homeService: HomeService, private loginService: LoginService) { }


  ngOnInit() {
    this.getBanner();
    const hash = sessionStorage.getItem('hash') ? JSON.parse(sessionStorage.getItem('hash')).hash : undefined;
    this.getUser().subscribe(user => {
      console.log(user);
      this.user = user;
    });
    if (hash) {
      this.loginService.getUserProfile(hash);
    }
  }

  getSearch(title) {
    this.subscription = this.homeService.getListSerie(title);
  }

  getBanner() {
    this.homeService.getSeries().subscribe(e => {
      this.serie = e;
    });
  }

  existMoreSeries() {
    if (this.serie.length > 1) {
      return true;
    } else if (this.serie.length === 1) {
      return false;
    } else {
      return true;
    }
  }

  getUser() {
    return this.loginService.getUser();
  }

  logout() {
    this.loginService.getLogout();
  }

}
