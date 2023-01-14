import secrets
import string
import os
from time import sleep
from urllib.parse import parse_qs, urlencode, urlparse
from configs import CONFIGS


def local_deps():
    import sys
    if sys.platform == "win32":
        sys.path.append(sys.path[0] + "\\site-packages\\windows")
    elif sys.platform =="linux":
        sys.path.append(sys.path[0] + "/site-packages/linux")
local_deps()
from azure_ad_verify_token import verify_jwt
from sqlalchemy import create_engine
import requests
from msal.oauth2cli.oauth2 import BaseClient as AzureAuthBaseClient
from flask.json import jsonify
import json



sqlalchemy_0_engine = ""
sqlalchemy_0_conn = ""
def set_up_sql_conn():
    global sqlalchemy_0_engine
    sqlalchemy_0_engine = create_engine(CONFIGS.mssql["conn_string"],pool_pre_ping=True)
    global sqlalchemy_0_conn
    sqlalchemy_0_conn = sqlalchemy_0_engine.connect()
set_up_sql_conn()


from werkzeug.http import parse_cookie

import pprint
pp = pprint.PrettyPrinter(indent=2, compact=False, width=1)
import sendgrid





# DEV ADDITIONS
class APIMsgFormat():
  def __init__ (self,data,access_token="",msg="OK"):
    self.data = data
    self.access_token = access_token
    self.msg = msg

  data ={
    "please ":"provide data in the data property"
  }
  access_token =""
  msg = "OK"
  code = ""

  def return_flask_response(self):
    return jsonify(self.__dict__)

class APIError(Exception):
    """All custom API Exceptions"""
    pass

class APIAuthError(APIError):
  code = 403
  description = "Authentication Error"

class APIServerError(APIError):
  code = 500
  description = "The server is having an issue processing the request please contact developer support"


sg = sendgrid.SendGridAPIClient(
    api_key=CONFIGS.azure_email["twillio_sendgrid_api_key"]
)


def print_if_dev(item,pretty=False):
    if os.getenv("FLASK_BACKEND_ENV") == "DEV":
        if pretty == True:
          pp.pprint(item)
        else:
          print(item)

def generate_random_string(len =7):
    return ''.join(secrets.choice(string.ascii_uppercase + string.ascii_lowercase) for i in range(len))

def turn_query_params_to_object(url):
    parsed_url = urlparse(url)
    return {
        x:y[0] for x,y in parse_qs(parsed_url.query).items()
    }

def turn_cookie_to_object(cookie_list,cookie_name):
    cookie = next(
        (cookie for cookie in cookie_list if cookie_name in cookie),
        None
    )
    return parse_cookie(cookie) if cookie is not None else cookie


def generate_twillio_sendgrid_email_req_body(from_email,to_emails=[],personalizations_subject="Sample Subject",email_template="Sample Email"):
  return {
    "personalizations":[{
      "to":[{"email":email} for email in to_emails],
      "subject":personalizations_subject
    }],
    "from":{"email":from_email},
    "content":[
      {
        "type": "text/html",
        "value": email_template
      }
    ]
  }

def generate_azure_graph_email_req_body(req_body,subject="DEV Subject",content_type="HTML",to_emails=None):

  default_to_emails = [CONFIGS.nibls_service_acct[0]["email"]]
  if(os.getenv("FLASK_BACKEND_ENV") != "DEV"):
    default_to_emails.append( "DashawnBledsoe@NIBLSInc771.onmicrosoft.com")
  default_to_emails_body = [
      {
        "emailAddress": {
          "address":email
        }
      } for email in default_to_emails
    ]

  return {
  "message": {
    "subject": subject,
    "body": {
      "contentType": content_type,
      "content": req_body
    },
    "toRecipients": to_emails if to_emails !=None else default_to_emails_body
  },
  "saveToSentItems": False
}




def _get_new_azure_application_access_token():
  url ="https://login.microsoftonline.com/{}/oauth2/v2.0/token".format(CONFIGS.azure_auth["ad_tenant_id"])
  req_body = urlencode({
    "client_id":CONFIGS.azure_auth["client_id"],
    "scope":"https://graph.microsoft.com/.default",
    "client_secret":CONFIGS.azure_auth["client_secret"],
    "grant_type":"client_credentials"
  })
  headers={
    "Content-Type":"application/x-www-form-urlencoded"
  }
  resp = requests.post(url, data=req_body,headers=headers)
  resp_body = resp.json()
  return resp_body["access_token"]


def get_myapp_azure_app_access_token(my_type = "default"):

  if(my_type == "default"):
    access_token = CONFIGS.azure_auth["app_access_token"]
  if(my_type == "email"):
    access_token = CONFIGS.azure_auth["365_e5_developer-ad"]["app_access_token"]

  try:
    # validate an app access token
    resp= requests.get(
      "https://graph.microsoft.com/v1.0/applications?$count=true",
      headers={"Authorization":"Bearer {}".format(access_token)}
    )
    if(resp.status_code != 200):
      raise Exception

  except Exception as e:
    print(resp.content)

    if(my_type == "default"):
      CONFIGS.azure_auth["app_access_token"] = _get_new_azure_application_access_token()
    if(my_type == "email"):
      CONFIGS.azure_auth["365_e5_developer-ad"]["app_access_token"] = _get_new_azure_application_email_access_token()
    get_myapp_azure_app_access_token()

  return CONFIGS.azure_auth["app_access_token"]



def _get_new_azure_application_email_access_token():
  print_if_dev(CONFIGS.azure_auth["365_e5_developer-ad"]["ad_tenant_id"])
  print_if_dev(CONFIGS.azure_auth["365_e5_developer-ad"]["client_id"])

  url ="https://login.microsoftonline.com/{}/oauth2/v2.0/token".format(CONFIGS.azure_auth["365_e5_developer-ad"]["ad_tenant_id"])

  req_body = urlencode({
    "client_id":CONFIGS.azure_auth["365_e5_developer-ad"]["client_id"],
    "scope":"https://graph.microsoft.com/.default",
    "client_secret":CONFIGS.azure_auth["365_e5_developer-ad"]["client_secret"],
    "grant_type":"client_credentials"
  })
  headers={
    "Content-Type":"application/x-www-form-urlencoded"
  }
  resp = requests.post(url, data=req_body,headers=headers)
  resp_body = resp.json()
  return resp_body["access_token"]


def send_email_azure(request_body):
    resp = requests.post(
      "https://graph.microsoft.com/v1.0/users/{}/sendMail".format(CONFIGS.azure_auth["developer_customer_AD_object_id"]),
      headers={
        "Authorization":"Bearer {}".format(get_myapp_azure_app_access_token("email")),
        "Content-type": "application/json"
      },
      data=json.dumps(request_body)
    )
    return resp


def send_email_restdbio(content,subject="DEV Subject",to_emails=None):
  headers = {
		"Content-Type": "application/json",
		"x-apikey":CONFIGS.restdbio_email["server_key"],
		"Cache-Control": "no-cache"
	}
  default_to_emails = to_emails if to_emails != None else [CONFIGS.nibls_service_acct[0]["email"]]
  if(os.getenv("FLASK_BACKEND_ENV") != "DEV"):
    default_to_emails.append( "DashawnBledsoe@NIBLSInc771.onmicrosoft.com")
  req_body={
    "to":default_to_emails,
    "subject":subject,
    "html": content,
    "company": "NIBLS",
    "sendername": "NIBLS Events & Promotions"
	}
  resp =requests.post(
    "https://niblsrestdbapp0-e183.restdb.io/mail",
    data=json.dumps(req_body),
    headers=headers
  )
  print_if_dev(resp.content)
  print_if_dev(resp.status_code)
  if(resp.status_code not in [200,201]):
    raise APIServerError


