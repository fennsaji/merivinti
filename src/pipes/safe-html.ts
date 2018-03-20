import { DomSanitizer } from "@angular/platform-browser";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'safeHtml'})
export class safeHtml implements PipeTransform{
  constructor(private santizer: DomSanitizer){}

  transform(html) {
    return this.santizer.bypassSecurityTrustResourceUrl(html);
  }
}
