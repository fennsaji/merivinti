import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './safe-html/safe-html';
import { TimeAgoPipe } from "time-ago-pipe";

@NgModule({
  declarations: [
    SafeHtmlPipe,
    TimeAgoPipe
  ],
	imports: [],
	exports: [
    SafeHtmlPipe,
    TimeAgoPipe
  ]
})
export class PipesModule {}
