import { Component, Inject, Input, OnInit } from '@angular/core';
import { SendLink } from '@cplace-next/api/cf-cplace-platform';
import {
  ControlState,
  ControlStateMap,
  CplaceDialogComponent,
  CplaceDialogSubmitButtonLabelVariantEnum,
  CplaceMessageService,
  CplaceSingletonRootProviderEnum,
  FormModel,
} from '@cplace-next/cf-frontend-sdk';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SendLinkDialogContext } from './types';

@UntilDestroy()
@Component({
  selector: 'cf-platform-lib-send-link-dialog',
  templateUrl: './send-link-dialog.component.html',
  styleUrls: ['./styles/send-link-dialog.component.scss'],
})
export class SendLinkDialogComponent extends CplaceDialogComponent<SendLinkDialogContext> implements OnInit {
  public static readonly SEND_LINK_DIALOG_ENDPOINT = '/cf.cplace.platform/dialogs/send-link';

  @Input() public entityUid = '';

  public recipientsControlState?: ControlState;
  public messageControlState?: ControlState;
  public sessionEntityId?: string;
  public formModel: FormModel = [
    {
      url: SendLinkDialogComponent.SEND_LINK_DIALOG_ENDPOINT,
      getResponse: (response: SendLink) => {
        const controlStates = response.controlStates as ControlStateMap;
        this.recipientsControlState = controlStates.get("'cf.cplace.sendLinkData.recipients'");
        this.messageControlState = controlStates.get("'cf.cplace.sendLinkData.message'");
        this.sessionEntityId = response.data.sessionEntityId;
      },
      getParams: () => {
        return {
          entityUid: this.entityUid,
          activeTabsInfo: this.readTabInfo(),
        };
      },
      postBody: () => {
        return {
          sessionEntityId: this.sessionEntityId,
        };
      },
      postResponse: () => {
        // need to keep an empty method for things to work properly
      },
    },
  ];

  public constructor(@Inject(CplaceSingletonRootProviderEnum.CplaceMessageService) private cplaceMessageService: CplaceMessageService) {
    super();
  }

  public ngOnInit() {
    this.submitButtonLabelVariant = CplaceDialogSubmitButtonLabelVariantEnum.ok;
    this.$context.pipe(untilDestroyed(this)).subscribe((context) => {
      if (context) {
        this.entityUid = context.entityUid;
        this.visible = true;
      }
    });
  }

  protected getDialogInstance(): CplaceDialogComponent<SendLinkDialogContext> {
    return this;
  }

  private readTabInfo(): string | undefined {
    const tabsInfo = window.location.hash.substring(1);
    return tabsInfo && tabsInfo.trim().length > 0 ? tabsInfo : undefined;
  }
}
