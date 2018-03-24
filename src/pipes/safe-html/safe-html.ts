import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private santizer: DomSanitizer){}

  transform(html) {
    // return this.santizer.bypassSecurityTrustResourceUrl(html);
    return this.santizer.bypassSecurityTrustUrl(html);
  }
}
