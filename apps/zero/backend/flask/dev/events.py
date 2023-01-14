from my_util import print_if_dev, pp,sqlalchemy_0_conn,generate_twillio_sendgrid_email_req_body,sg,send_email_restdbio
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


myevents = Blueprint("events", __name__, url_prefix="/events")
admin_email_template = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Ticket Purchased</title>
            </head>
            <body>
              <code>
              {}
              </code>
            </body>
            </html>
          """

@myevents.route("/get_events", methods=["POST"])
def get_events():

    resp = get_events_from_eventbrite()

    return {"msg": "A-OK", "data": []}, 200


@myevents.route("/purchase_ticket", methods=["POST"])
def purchase_ticket_events():
    data = request.json["data"]

    confirmation_id = str(uuid.uuid4())
    to = [{"email": CONFIGS.nibls_service_acct[0]["email"]}]
    if os.getenv("FLASK_BACKEND_ENV") != "DEV":
        to.append({"email": "DashawnBledsoe@NIBLSInc771.onmicrosoft.com"})

    from_email = CONFIGS.nibls_service_acct[0]["email"]
    to_emails = [
      CONFIGS.nibls_service_acct[0]["email"]
    ]

    personalizations_subject = "Ticket Purchased Confirmation ID {}".format(confirmation_id)
    email_template = admin_email_template.format(
                    json.dumps(data, indent=4)
                    .replace(" ", "&nbsp;")
                    .replace("\n", "<br>")
                )
    if os.getenv("FLASK_BACKEND_ENV") != "DEV":
      to_emails.append( "DashawnBledsoe@NIBLSInc771.onmicrosoft.com")
    else:
      personalizations_subject = "{} {}".format("DEV",personalizations_subject)

    send_email_restdbio(email_template,personalizations_subject)
    with open(
        "my_resources/purchased_ticket_email_template/index.html", encoding="utf-8"
    ) as fh:

        from_email = CONFIGS.nibls_service_acct[0]["email"]
        to_emails = [
          CONFIGS.nibls_service_acct[0]["email"]
        ]
        personalizations_subject = "Event Confirmation {}".format(data["event_title"])
        email_template = fh.read().format(data["name"], data["email"], data["ticket_quantity"], confirmation_id)
        if os.getenv("FLASK_BACKEND_ENV") != "DEV":
          to_emails = [
            data['email']
          ]
        else:
          personalizations_subject = "{} {}".format("DEV",personalizations_subject)

        send_email_restdbio(email_template,personalizations_subject,to_emails)

    return {"msg": "A-OK", "data": "OK"}, 200

@myevents.route("/get_niblsball_events",methods=["GET"])
def get_niblsball_events():
  rs = sqlalchemy_0_conn.execute("""
    SELECT * FROM Events.VW_Event_Match_Info
    WHERE matchTime > GETDATE()
    ORDER BY matchTime
    """)
  events = []
  for row in rs:
      events.append(dict(row))
  return {
    "msg":"OK",
    "data" :events
  },200




def get_events_from_eventbrite():
    url = "https://www.eventbriteapi.com/v3/organizations/{}/events".format(
        CONFIGS.eventbrite["organization_id"]
    )
    query_params = {"time_filter": "current_future"}
    headers = {
        "Authorization": "Bearer {}".format(CONFIGS.eventbrite["priviate_oauth_token"])
    }
    resp = requests.get(url=url, headers=headers, params=query_params)
    return resp
