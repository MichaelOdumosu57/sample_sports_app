// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';

// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';

// rxjs
import { forkJoin, from, of, Subject } from 'rxjs';
import { concatMap, finalize, map, pluck, takeUntil, tap } from 'rxjs/operators';

// misc
import { ENV } from '@app/core/config/configs';
import { WMLButton, WMLImage } from '@windmillcode/wml-components-base';
import { HttpClient } from '@angular/common/http';

// morals
import { ethers } from 'ethers';
import { MoralisService } from '@shared/services/moralis/moralis.service';

@Component({
  selector: 'events-main',
  templateUrl: './events-main.component.html',
  styleUrls: ['./events-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class EventsMainComponent {

  constructor(
    private cdref: ChangeDetectorRef,
    private utilService: UtilityService,
    private configService: ConfigService,
    private baseService: BaseService,
    private http: HttpClient,
    private moralisService:MoralisService
  ) { }
  classPrefix = this.utilService.generateClassPrefix('EventsMain')
  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub = new Subject<void>()


  metamask = {

    verifyMessage: (message, signature) => {
      return this.http.post(
        ENV.eventsMain.metamaskVerifyMessage(),
        {
          data: {
            message,
            signature,
            network: 'evm',
          }
        }
      )
    },
    requestMessage: (account, chain) => {
      return this.http.post(
        ENV.eventsMain.metamaskRequestMessage(),
        {
          data: {
            address: account,
            chain: chain,
            network: 'evm',
          }
        }
      )
    },
    handleAuth: () => {

      return this.metamask.connectToMetamask()
        .pipe(
          takeUntil(this.ngUnsub),
          concatMap(({ signer, chain, account }) => {
            if (!account) {
              throw new Error('No account found');
            }
            if (!chain) {
              throw new Error('No chain found');
            }

            return forkJoin([
              this.metamask.requestMessage(account, chain),
              of(signer)
            ])
          }),
          concatMap((res) => {
            // @ts-ignore
            let [{ data }, signer] = res
            return forkJoin([
              of(data.message),
              signer.signMessage(data.message),
            ])
          }),
          concatMap(([message, signature]) => {
            return this.metamask.verifyMessage(message, signature)
          }),
          tap(console.log)

        )


    },
    connectToMetamask: () => {
      let provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      return from(Promise.all([
        provider.send('eth_requestAccounts', []),
        provider.send('eth_chainId', []),
      ]))
        .pipe(
          takeUntil(this.ngUnsub),
          map((res) => {
            let [accounts, chainId] = res
            let signer = provider.getSigner();

            return { signer, chain: chainId, account: accounts[0] };
          })
        )

    }
  }

  walletButtons = ["eventsMain.wallet.options.0.value"]
    .map((value, index0) => {
      return new WMLButton({
        // click: () => this.metamask.handleAuth().subscribe(),
        click: () => this.moralisService.login().subscribe(),
        value,
        iconSrc: "assets/media/shared/wallet_icon.svg",
        iconAlt: "eventsMain.wallet.options." + index0 + ".value"
      })
    })


  handballImg = new WMLImage({
    src:"assets/media/events-main/handball.jpg",
    alt:"eventsMain.handballImg.alt"
  })




  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}
