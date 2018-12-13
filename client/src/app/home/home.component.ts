import { HomeService } from './home.service';
import { Component, OnInit } from '@angular/core';
import { NgbRatingConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  series: [];

  constructor(private homeService: HomeService, config: NgbRatingConfig, private modalService: NgbModal) {
    // customize default values of ratings used by this component tree
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {
    this.homeService.getListSerie();

    this.homeService.getSeries().subscribe(series => {
      this.series = series;
      // console.log(this.series);
    });
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  existSeries() {
    if (this.series.length === 0) {
      return true;
    }
    return false;
  }

}
