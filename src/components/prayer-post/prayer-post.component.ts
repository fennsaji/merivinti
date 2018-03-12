import { Component, Input } from "@angular/core";

@Component({
  selector: 'prayer-post',
  templateUrl: 'prayer-post.component.html'
})
export class PrayerPostComponent {
  @Input() PrayerReq: any;

}
