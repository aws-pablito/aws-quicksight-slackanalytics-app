import json
import random


# Sample lambda function to respond to test scenarios of the connector build
def lambda_handler(event, context):
    
    print(event)
    print("Executing DATA event...")
    request_date = event["queryStringParameters"]["date"]
    data_array = []
    
    for x in range(1000):
        activity = random.randint(0, 60)
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
            "is_active_desktop": True,
            "reactions_added_count": random.randint(0, 20),
            "messages_posted_count": random.randint(0, 40),
            "channel_messages_posted_count": activity,
            "files_added_count": 5
        })
    
    result = [json.dumps(record) for record in data_array]
    
    # slack analytics api outputs new line delimited json
    return { 
      "statusCode": 200,
      "body": '\n'.join(result)
    }
