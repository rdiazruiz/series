import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '../home/home.service';
import { CommentsService } from '../comments/comments.service';

@Component({
  selector: 'app-serie',
  templateUrl: './serie.component.html',
  styleUrls: ['./serie.component.scss']
})
export class SerieComponent implements OnInit {
  serie;
  id;
  urlSinProcesar;
  urlSaneada;
  url;
  changeHover = false;

  constructor(private _route: ActivatedRoute,
    private homeService: HomeService, private sanitizer: DomSanitizer, config: NgbRatingConfig, private commentsService:CommentsService) {
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {
    this.filterById();
  }

  filterById() {
    this.id = this._route.snapshot.paramMap.get('id');
    this.homeService.getSerieById(this.id).subscribe(
      (serie: any) => {
        this.serie = serie;
        this.getUrlVideo(serie.details.linkSeasons[0].url);
      },
      (err) => console.log(err)
    );
  }

  getUrlVideo(url) {
    if (url) {
      url = url + '?autoplay=1&rel=0&showinfo=0&controls=1';
      url = url.replace('watch?v=', 'embed/');
    }
    this.urlSinProcesar = url;
    this.urlSaneada = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlSinProcesar);
  }

  change() {
    this.changeHover = !this.changeHover;
  }

}
