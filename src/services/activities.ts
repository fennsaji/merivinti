// import { Injectable } from "@angular/core";
// import { Platform, ActionSheetController } from "ionic-angular";
// import { PrayerService } from "./prayer";

// @Injectable()
// export class ActivitiesService {
//   constructor(public platform: Platform,
//     public actionSheet: ActionSheetController,
//     private prayerSer: PrayerService) {}

//   loadPrayerOptions() {
//     const options = this.actionSheet.create(
//       {
//         title: 'Prayer Request',
//         cssClass: 'action-sheets-basic-page',
//         buttons: [
//           {
//             text: 'Delete',
//             role: 'destructive',
//             icon: !this.platform.is('ios') ? 'trash' : null,
//             handler: () => {
//               console.log('Delete clicked');
//               this.prayerSer.deletePr(prayerId)
//                 .subscribe(doc => {
//                   this.prayerReq.splice(index, 1);
//                 })
//             }
//           },
//           {
//             text: 'Share',
//             icon: !this.platform.is('ios') ? 'share' : null,
//             handler: () => {
//               // this.sharePrayerReq(index);
//             }
//           },
//           {
//             text: 'Edit',
//             icon: !this.platform.is('ios') ? 'hammer' : null,
//             handler: () => {
//               console.log('Play clicked');
//             }
//           },
//           {
//             text: 'Report',
//             icon: !this.platform.is('ios') ? 'alert' : null,
//             handler: () => {
//               console.log('Play clicked');
//             }
//           },
//           {
//             text: 'Cancel',
//             role: 'cancel', // will always sort to be on the bottom
//             icon: !this.platform.is('ios') ? 'close' : null,
//             handler: () => {
//               console.log('Cancel clicked');
//             }
//           }
//         ]
//       }
//     );
//     options.present();
//   }
// }
