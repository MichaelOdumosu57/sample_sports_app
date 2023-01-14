import { Injectable } from '@angular/core';
import { BaseService } from '@core/base/base.service';
import { ENV } from '@core/config/configs';
import { concatMap, finalize, from, iif, of, takeUntil, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoralisService {
  constructor(public baseService: BaseService) {}

  initSDKIsPresent = false;
  initSDK = () => {
    if (this.initSDKIsPresent) {
      return;
    }
    const serverUrl = 'https://1s5ua3oigxiz.usemoralis.com:2053/server';
    const appId = 'ZRyDvQLCtkeRik3D5EeIKevU5Den3lPi14M7tO1p';
    Moralis.start({ serverUrl, appId });
  };

  moralisUser;
  login = () => {
    if (!this.moralisUser) {
      this.initSDK();
      return from(
        Moralis.authenticate({
          signingMessage: 'Add Metamask Wallet',
        })
      ).pipe(
        tap((user) => {
          this.moralisUser = user;
        }),
        finalize(console.log)
      );
    }
    return of(null);
  };

  logOut = () => {
    Moralis.User.logOut();
  };

  sendETHToSourceWallet = (units: string) => {
    let options = {
      type: 'native',
      amount: Moralis.Units.ETH(units),
      receiver: '0x8067F9FA01b9e8564d50d03A21623BFb578C5C46',
    };

    this.initSDK();
    return iif(
      () => ENV.moralis.sendETHToSourceWalletEndpoint.automate,
      of(null),
      this.login()
      .pipe(
        concatMap(() => {
          return from(Moralis.transfer(options));
        }),
        concatMap((transaction: any) => {
          return from(transaction.wait());
        }),
        this.baseService.closeOverlayLoading,
        tap({
          next: (res) => {
            console.log('next fired', res);
          },
          error: (res) => {
            console.log('error fired', res);
          },
          complete: () => {
            console.log('complete fired');
          },
        })
      )
    );
  };
}
