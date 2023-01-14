import os

class DevConfigs:

  endpointMsgCodes = {
    'success':'OK',
    'error':'ERROR',
  }
  nibls_service_acct = [
    {
      'email':"Developer@NIBLSInc771.onmicrosoft.com"
    }
  ]
  NEWSAPI_APIKEY =os.getenv("NEWSAPI_KEY")
  NEWSAPI_ENDPOINT ="https://newsapi.org/v2/top-headlines"
  app= {
    'access_control_allow_origin':['https://example.com:4200','https://example.com:4201'],
    'server_name':'example.com:5000',
    'domain_name':'https://example.com:5000',
    'flask_env':'development',
    'frontend_angular_app_url':'https://example.com:4200',
    'frontend_angular_app_domain':'example.com'
  }
  spotify = {
    'client_id':os.getenv("SPOTIFY_APP_0_CLIENT_ID"),
    'client_secret':os.getenv("SPOTIFY_APP_0_CLIENT_SECRET"),
    'client_scope':'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative',
    'show_dialog_to_change_spotify_user_acct':False
  }
  moralis = {
    'web3_api_key':os.getenv("MORALIS_WEB3_API_KEY")
  }
  eventbrite = {
    'priviate_oauth_token':os.getenv("EVENTBRITE_PRIVATE_OAUTH_TOKEN"),
    'organization_id':"1025372220563"
  }
  azure_email = {
    'twillio_sendgrid_api_key':os.getenv("NIBLS_TWILLIO_SENGRID_APIKEY_0"),
    'endpoint':"https://contoso.westus.communications.azure.com/emails:send?api-version=2021-10-01-preview"
  }
  restdbio_email ={
    "server_key":os.getenv("RESTDBIO_SERVER_API_KEY_0"),
  }

  azure_auth = {
    "365_e5_developer-ad":{
      "ad_tenant_id":"5aa8a4e0-068a-4f2c-8929-4a77215e9529",
      "app_access_token":"",
      "client_id":"27d9c1c0-6f99-41d3-9583-7844461554f8",
      "client_secret":os.getenv("AZURE_AUTH_1_CLIENT_SECRET")
    },
    "app_access_token":"",
    "developer_customer_AD_object_id":"a2f416a9-5376-4123-8d7a-e4f68b28efda",
    "developer_customer_AD_principal_name":"developer_niblsinc771.onmicrosoft.com#EXT#@niblscoin.onmicrosoft.com",
    "b2c_tenant" : "niblscoin",
    "ad_tenant_id":"6ec537e6-c82d-4caa-91a9-e7ba59ebf85a",
    "signupsignin_user_flow" : "B2C_1_nibls-webapp-acctmgnt-signupsignin-0",
    "editprofile_user_flow" : "B2C_1_nibls-webapp-acctmgnt-1-profileediting-0",
    "signupsignin_authority":"",
    "editprofile_authority":"",
    "issuer": "https://niblscoin.b2clogin.com/6ec537e6-c82d-4caa-91a9-e7ba59ebf85a/v2.0/",
    "jwks_url": "https://niblscoin.b2clogin.com/niblscoin.onmicrosoft.com/b2c_1_nibls-webapp-acctmgnt-signupsignin-0/discovery/v2.0/keys",
    "client_id":"c3a61ac9-f5c2-4fb0-afc7-7c16246e1a67",
    "client_secret":os.getenv("AZURE_AUTH_0_CLIENT_SECRET"),
    "endpoint":"",
    "scope":["openid offline_access"],
    "application_id_uri":"https://niblscoin.onmicrosoft.com/c3a61ac9-f5c2-4fb0-afc7-7c16246e1a67"
  }
  mssql = {

    "conn_string":os.getenv("SQLALCHEMY_PYMSSQL_0_CONN_STRING")
  }

  def __init__(self):
    authority_template = "https://{tenant}.b2clogin.com/{tenant}.onmicrosoft.com/{user_flow}"
    self.azure_auth["signupsignin_authority"] = authority_template.format(
    tenant=self.azure_auth["b2c_tenant"], user_flow=self.azure_auth["signupsignin_user_flow"])
    self.azure_auth["editprofile_authority"] = authority_template.format(
    tenant=self.azure_auth["b2c_tenant"], user_flow=self.azure_auth["editprofile_user_flow"])


class TestConfigs(DevConfigs):
  None

class PreviewConfigs(DevConfigs):

  def __init__(self) -> None:
    super().__init__()
    self.app['flask_env'] = 'development'
    self.app['server_name']= "169.254.129.3"
    self.app['domain_name'] = 'https://nibls-flask-backend-0.azurewebsites.net'
    self.app['access_control_allow_origin']= ["https://ambitious-sand-0ab399110-preview.centralus.1.azurestaticapps.net"]
    self.app['frontend_angular_app_url'] = self.app['access_control_allow_origin'][0]
    self.app['frontend_angular_app_domain'] = "ambitious-sand-0ab399110-preview.centralus.1.azurestaticapps.net"
    self.spotify['show_dialog_to_change_spotify_user_acct'] = True


class ProdConfigs(DevConfigs):

  def __init__(self) -> None:
    super().__init__()
    self.app['flask_env'] = 'production'
    self.app['server_name']= "169.254.129.3"
    self.app['domain_name'] = 'https://nibls-flask-backend-0.azurewebsites.net'
    self.app['access_control_allow_origin']= ["https://www.niblscoin.com"]
    self.app['frontend_angular_app_url'] = self.app['access_control_allow_origin'][0]
    self.app['frontend_angular_app_domain'] ='niblscoin.com'
    self.spotify['show_dialog_to_change_spotify_user_acct'] = True

CONFIGS= {
  'PROD':lambda x:ProdConfigs(),
  'PREVIEW':lambda x:PreviewConfigs(),
  'DEV':lambda x:DevConfigs(),
  'TEST':lambda x:TestConfigs(),
}[os.getenv("FLASK_BACKEND_ENV")](None)







