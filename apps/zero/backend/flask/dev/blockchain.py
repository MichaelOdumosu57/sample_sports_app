from urllib import response
from configs import CONFIGS
import requests;
import math
from flask import Blueprint,request
import json 
from my_util import print_if_dev 


myblockchain =Blueprint("blockchain", __name__, url_prefix="/blockchain")


@myblockchain.route('/metamask_request_message',methods=['POST'])
def metamask_request_message():
  data = request.json['data']
  print_if_dev(data,True)

  REQUEST_URL = 'https://authapi.moralis.io/challenge/request/evm'
  request_object = {
    "domain": "defi.finance",
    "chainId": 1,
    "address": data['address'],
    "statement": "Please confirm",
    "uri": "https://defi.finance/",
    "expirationTime": "2023-01-01T00:00:00.000Z",
    "notBefore": "2020-01-01T00:00:00.000Z",
    "timeout": 15
  }
  resp = requests.post(
      REQUEST_URL,
      json=request_object,
      headers={'X-API-KEY': CONFIGS.moralis['web3_api_key']})

  return {
    'data':resp.json(),
    'code':CONFIGS.endpointMsgCodes['success']
  },200



@myblockchain.route('/metamask_verify_message',methods=['POST'])
def verify_message():
    data = request.json['data']
    print_if_dev(data,True)

    REQUEST_URL = 'https://authapi.moralis.io/challenge/verify/evm'
    resp = requests.post(
        REQUEST_URL,
        json=data,
        headers={'X-API-KEY': CONFIGS.moralis['web3_api_key']})
    resp_body = resp.json()
    if resp.status_code == 201:
        # user can authenticate
        eth_address=resp_body.get('address')
        print_if_dev("eth address", eth_address)
        
        return {
          'data':{
            'auth_info':data,
            'verified_data':resp_body
          }
        },200
    else:
        return {
          'data':{
            'msg':resp_body
          }
        },200