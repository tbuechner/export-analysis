import json

from dotenv import load_dotenv
from openai import OpenAI
import os
import requests
from openai.lib.azure import AzureOpenAI



def provide_user_specific_recommendations(user_input, user_id):
    customer_profile = {
        "name": "John Doe",
        "location": {
            "latitude": 37.7955,
            "longitude": -122.4026,
        },
        "preferences": {
            "food": ["Italian", "Sushi"],
            "activities": ["Hiking", "Reading"],
        },
        "behavioral_metrics": {
            "app_usage": {
                "daily": 2,  # hours
                "weekly": 14  # hours
            },
            "favourite_post_categories": ["Nature", "Food", "Books"],
            "active_time": "Evening",
        },
        "recent_searches": ["Italian restaurants nearby", "Book clubs"],
        "recent_interactions": ["Liked a post about 'Best Pizzas in New York'", "Commented on a post about 'Central Park Trails'"],
        "user_rank": "Gold",  # based on some internal ranking system
    }

    if customer_profile is None:
        return "I couldn't find your profile. Could you please verify your user ID?"

    customer_profile_str = json.dumps(customer_profile)

    food_preference = customer_profile.get('preferences', {}).get('food', [])[0] if customer_profile.get('preferences', {}).get('food') else None


    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": f"You are a sophisticated AI assistant, a specialist in user intent detection and interpretation. Your task is to perceive and respond to the user's needs, even when they're expressed in an indirect or direct manner. You excel in recognizing subtle cues: for example, if a user states they are 'hungry', you should assume they are seeking nearby dining options such as a restaurant or a cafe. If they indicate feeling 'tired', 'weary', or mention a long journey, interpret this as a request for accommodation options like hotels or guest houses. However, remember to navigate the fine line of interpretation and assumption: if a user's intent is unclear or can be interpreted in multiple ways, do not hesitate to politely ask for additional clarification. Make sure to tailor your responses to the user based on their preferences and past experiences which can be found here {customer_profile_str}"
            },
            {"role": "user", "content": user_input}
        ],
        temperature=0,
        tools=[
            {
                "type": "function",
                "function" : {
                    "name": "call_google_places_api",
                    "description": "This function calls the Google Places API to find the top places of a specified type near a specific location. It can be used when a user expresses a need (e.g., feeling hungry or tired) or wants to find a certain type of place (e.g., restaurant or hotel).",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "place_type": {
                                "type": "string",
                                "description": "The type of place to search for."
                            }
                        }
                    },
                    "result": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                }
            }
        ],
    )

    # convert response to a string
    response_str = str(response)
    print("Response:", response_str)

    print(response.choices[0].message.tool_calls)

    if response.choices[0].finish_reason=='tool_calls':
        function_call = response.choices[0].message.tool_calls[0].function
        if function_call.name == "call_google_places_api":
            place_type = json.loads(function_call.arguments)["place_type"]
            print("Place type:", place_type)
            print("Calling Google Places API...")
            return "Result from Google Places API...."


load_dotenv()

api_key = os.environ.get("AZURE_OPENAI_API_KEY", "<your OpenAI API key if not set as env var>")

azure_openai_endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT", "https://api.openai.com")

print("API Key:", api_key)

client = AzureOpenAI(
    api_version="2024-02-01",
    azure_endpoint = azure_openai_endpoint,
    azure_deployment = "gpt-35-turbo",
    api_key=api_key)

user_id = "user1234"
user_input = "I'm hungry"
output = provide_user_specific_recommendations(user_input, user_id)
print(output)
