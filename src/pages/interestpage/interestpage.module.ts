import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterestpagePage } from './interestpage';

@NgModule({
  declarations: [
    InterestpagePage,
  ],
  imports: [
    IonicPageModule.forChild(InterestpagePage),
  ],
  exports: [
    InterestpagePage
  ]
})
export class InterestpagePageModule {}
