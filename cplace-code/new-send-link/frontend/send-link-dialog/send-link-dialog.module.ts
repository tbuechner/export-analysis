import { CommonModule } from '@angular/common';
import { Inject, NgModule } from '@angular/core';
import {
  CplaceControlModule,
  CplaceDialogModule,
  CplaceFormProviderService,
  CplaceSingletonRootProviderEnum,
  I18nModule,
  TranslationService,
} from '@cplace-next/cf-frontend-sdk';
import { MessageModule } from 'primeng/message';
import * as de from './lang/de.json';
import * as en from './lang/en.json';
import { SendLinkDialogComponent } from './send-link-dialog.component';

@NgModule({
  declarations: [SendLinkDialogComponent],
  exports: [SendLinkDialogComponent],
  providers: [CplaceFormProviderService],
  imports: [CommonModule, CplaceDialogModule, MessageModule, CplaceControlModule, I18nModule],
})
export class SendLinkDialogModule {
  constructor(@Inject(CplaceSingletonRootProviderEnum.TranslationService) private translationService: TranslationService) {
    this.translationService.addTranslation({
      translations: {
        en: en,
        de: de,
      },
    });
  }
}
