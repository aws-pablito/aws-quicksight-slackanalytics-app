import json
import random
import datetime


# Sample lambda function to respond to test scenarios of the connector build
def lambda_handler(event, context):
    
    print(event)
    request_date = event["queryStringParameters"]["date"]
    print("Executing DATA event for {}...".format(request_date))

    date = datetime.datetime.strptime(request_date, '%Y-%m-%d')
    current_date = datetime.datetime.now()
    day_diff = (current_date - date).days
    data_array = []
    
    for x in range(1000):
        activity = get_random(day_diff)
        is_active = False
        if activity > 0:
            is_active = True

        userid = "W1F83A9F9_" + str(x)
        useremail = "person" + str(x) + "@acme.com"
        data_array.append({
            "date": request_date,
            "enterprise_id": "E2XXXXXX",
            "enterprise_user_id": userid,
            "email_address": useremail,
            "enterprise_employee_number": "273849373",
            "is_guest": False,
            "is_billable_seat": True,
            "is_active": is_active,
            "is_active_iOS": False,
            "is_active_Android": False,
            "is_active_desktop": is_active,
            "reactions_added_count": random.randint(0, 20),
            "messages_posted_count": random.randint(0, 40),
            "channel_messages_posted_count": activity,
            "files_added_count": random.randint(0, 3)
        })
    
    result = [json.dumps(record) for record in data_array]
    body = '\n'.join(result)
    
    # slack analytics api outputs new line delimited json compressed in gzip encoding
    return { 
      "statusCode": 200,
      "body": body
    }


# Introduce a positive activity trend on mockup data.
def get_random(day_diff):
    random_int = random.randint(0, 100)
    if day_diff > 20 and random_int < 60:
        return 0
    if day_diff > 10 and random_int < 20:
        return 0
    return random_int
