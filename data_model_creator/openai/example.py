import json

from dotenv import load_dotenv
from openai import OpenAI
import os
import requests
from openai.lib.azure import AzureOpenAI


def fetch_customer_profile(user_id):
    # You can replace this with a real API call in the production code
    if user_id == "user1234":
        return {
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
    else:
        return None


def get_place_details(place_id, api_key):
    URL = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&key={api_key}"
    response = requests.get(URL)
    if response.status_code == 200:
        result = json.loads(response.content)["result"]
        return result
    else:
        print(f"Google Place Details API request failed with status code {response.status_code}")
        print(f"Response content: {response.content}")
        return None

def call_google_places_api(user_id, place_type, food_preference=None):
    try:
        # Fetch customer profile
        customer_profile = fetch_customer_profile(user_id)
        if customer_profile is None:
            return "I couldn't find your profile. Could you please verify your user ID?"

        # Get location from customer profile
        lat = customer_profile["location"]["latitude"]
        lng = customer_profile["location"]["longitude"]

        API_KEY = os.getenv('GOOGLE_PLACES_API_KEY')  # retrieve API key from environment variable
        LOCATION = f"{lat},{lng}"
        RADIUS = 500  # search within a radius of 500 meters
        TYPE = place_type

        # If the place_type is restaurant and food_preference is not None, include it in the API request
        if place_type == 'restaurant' and food_preference:
            URL = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={LOCATION}&radius={RADIUS}&type={TYPE}&keyword={food_preference}&key={API_KEY}"
        else:
            URL = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={LOCATION}&radius={RADIUS}&type={TYPE}&key={API_KEY}"

        response = requests.get(URL)
        if response.status_code == 200:
            results = json.loads(response.content)["results"]
            places = []
            for place in results[:2]:  # limit to top 2 results
                place_id = place.get("place_id")
                place_details = get_place_details(place_id, API_KEY)  # Get the details of the place

                place_name = place_details.get("name", "N/A")
                place_types = next((t for t in place_details.get("types", []) if t not in ["food", "point_of_interest"]), "N/A")  # Get the first type of the place, excluding "food" and "point_of_interest"
                place_rating = place_details.get("rating", "N/A")  # Get the rating of the place
                total_ratings = place_details.get("user_ratings_total", "N/A")  # Get the total number of ratings
                place_address = place_details.get("vicinity", "N/A")  # Get the vicinity of the place

                if ',' in place_address:  # If the address contains a comma
                    street_address = place_address.split(',')[0]  # Split by comma and keep only the first part
                else:
                    street_address = place_address

                # Prepare the output string for this place
                place_info = f"{place_name} is a {place_types} located at {street_address}. It has a rating of {place_rating} based on {total_ratings} user reviews."

                places.append(place_info)

            return places
        else:
            print(f"Google Places API request failed with status code {response.status_code}")
            print(f"Response content: {response.content}")  # print out the response content for debugging
            return []
    except Exception as e:
        print(f"Error during the Google Places API call: {e}")
        return []


def provide_user_specific_recommendations(user_input, user_id):
    customer_profile = fetch_customer_profile(user_id)
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

    print(response.choices[0].message.tool_calls)

    if response.choices[0].finish_reason=='tool_calls':
        function_call = response.choices[0].message.tool_calls[0].function
        if function_call.name == "call_google_places_api":
            place_type = json.loads(function_call.arguments)["place_type"]
            places = call_google_places_api(user_id, place_type, food_preference)
            if places:  # If the list of places is not empty
                return f"Here are some places you might be interested in: {' '.join(places)}"
            else:
                return "I couldn't find any places of interest nearby."

    return "I am sorry, but I could not understand your request."


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
