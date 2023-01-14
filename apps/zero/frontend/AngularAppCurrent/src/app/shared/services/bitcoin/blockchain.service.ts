import { Injectable } from '@angular/core';
import { BaseService } from '@core/base/base.service';
import { ENV } from '@env/environment';
import { from, tap, finalize, of, iif, concatMap, catchError, throwError } from 'rxjs';

import { chain, configureChains, createClient} from '@wagmi/core'
import { modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  constructor(public baseService: BaseService) {}




  wagmi = {
    provider:null,
    chains:null,
    client:null,
    metamask: {
      client:null,
      connect:null,
      account:null
    },
    coinbase: {
      client:null,
      connect:null,
      account:null
    }

  }

  wagmiInit =(()=>{

    let obj = {
      projectId:"7719df979c0c2c17a4be0b52725ad73f",
      chains:ENV.blockchainService.chains
    }
    Object.assign(this.wagmi,obj)
    this.wagmi.provider = configureChains(obj.chains, [walletConnectProvider({ projectId:obj.projectId })])
    this.wagmi.client = createClient({
      autoConnect: true,
      connectors: modalConnectors({ appName: 'nibls-walletconnect-app-0', chains:obj.chains }),
      provider:this.wagmi.provider
    })
    this.wagmi.metamask.client = new MetaMaskConnector()
    this.wagmi.metamask.connect = ()=>{
      return from(this.wagmi.metamask.client.connect())
      .pipe(
        tap((res)=>{
          this.wagmi.metamask.account = res
        })
      )

    }
    this.wagmi.coinbase.client = new CoinbaseWalletConnector({
      chains:obj.chains,
      options:{
        appName:"nibls-walletconnect-project-0",
        jsonRpcUrl:"",
        chainId:chain.goerli.id
      }
    })
    this.wagmi.coinbase.connect = ()=>{
      return from(this.wagmi.coinbase.client.connect())
      .pipe(
        tap((res)=>{

          this.wagmi.coinbase.account = res
        })
      )

    }


  })()
  moralis = {
    metamask:{},
    coinbase:{},
    currentWallet:"",
    initSDKIsPresent : false,
    initSDK :() => {
      if (this.moralis.initSDKIsPresent) {
        return;
      }
      this.moralis.initSDKIsPresent = true
      const serverUrl = 'https://1s5ua3oigxiz.usemoralis.com:2053/server';
      const appId = 'ZRyDvQLCtkeRik3D5EeIKevU5Den3lPi14M7tO1p';
      Moralis.start({ serverUrl, appId });
    },


    user:null,
    login : (type:"metamask"|"coinbase" | string) => {
      if (!this.moralis.user) {
        this.moralis.currentWallet = type
        this.moralis.initSDK();

        return from(
          Moralis.authenticate({
            signingMessage: 'Add ' +type+ ' wallet',
          })
        ).pipe(
          tap((user) => {
            this.moralis.user = user;
          }),
          finalize(console.log)
        );
      }
      return of(null);
    },

    logOut : () => {
      Moralis.User.logOut();
    },

    sendETHToSourceWallet : (units: string) => {
      let options = {
        type: 'native',
        amount: Moralis.Units.ETH(units),
        receiver: '0x8067F9FA01b9e8564d50d03A21623BFb578C5C46',
      };

      this.moralis.initSDK();
      return iif(
        () => ENV.moralis.sendETHToSourceWalletEndpoint.automate,
        of(null),
        this.moralis.login(this.moralis.currentWallet)
        .pipe(

          concatMap(() => {
            return from(Moralis.transfer(options));
          }),
          concatMap((transaction: any) => {
            return from(transaction.wait());
          }),
          this.baseService.closeOverlayLoading,
          catchError((err)=>{
            let errCode
            if(err.message.includes("code=INSUFFICIENT_FUNDS")){
              errCode = ENV.errorCodes.NOTENOUGHFUNDS
            }

            return throwError(()=>errCode)
          })
        )
      );
    }
  }
}
