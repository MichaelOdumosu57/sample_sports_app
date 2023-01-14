from my_util import print_if_dev, pp,sqlalchemy_0_conn,generate_azure_graph_email_req_body,sg,_get_new_azure_application_access_token,get_myapp_azure_app_access_token,APIServerError,send_email_azure,send_email_restdbio
from configs import CONFIGS
import requests
import math
from flask import Blueprint, request
import json
from urllib.parse import urlparse
import sendgrid
from sendgrid.helpers.mail import *
import os
import uuid


mycollegiate = Blueprint("collegiate", __name__, url_prefix="/collegiate")


sponsorship_request_title = "Collgiate Sponsorship Accelerator Request"
sponsorship_request_email_template = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>{sponsorship_request_title} Application</title>
            </head>
            <body>
              <code>
              {}
              </code>
            </body>
            </html>
          """


@mycollegiate.route("/submit_collegiate_sponsorship_accelerator_form", methods=["POST"])
def submit_collegiate_sponsorship_accelerator_form_collegiate():
    data = request.json["data"]
    email_data = {
      k:v for k,v in data.items() if k != "team_logo" and k != "pitch_deck"
    }
    confirmation_id = "collegiate_sponsorship_accelerator_form_"+str(uuid.uuid4())

    from_email = CONFIGS.nibls_service_acct[0]["email"]
    to_emails = [
      CONFIGS.nibls_service_acct[0]["email"]
    ]

    personalizations_subject = "Collegiate Sponsorship Request Form ID {}".format(confirmation_id)
    email_template = sponsorship_request_email_template.format(
                    json.dumps(email_data, indent=4)
                    .replace(" ", "&nbsp;")
                    .replace("\n", "<br>"),
                    sponsorship_request_title=sponsorship_request_title
                )

    if os.getenv("FLASK_BACKEND_ENV") != "DEV":
      to_emails.append( "DashawnBledsoe@NIBLSInc771.onmicrosoft.com")
    else:
      personalizations_subject = "{} {}".format("DEV",personalizations_subject)
    # sponsorship_request_body = generate_azure_graph_email_req_body(email_template,personalizations_subject)
    # resp = send_email_azure(sponsorship_request_body)

    send_email_restdbio(email_template,personalizations_subject)


    return {"msg": "A-OK", "data": "OK"}, 200
