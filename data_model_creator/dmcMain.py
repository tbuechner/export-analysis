from dotenv import load_dotenv

from data_model_creator.api import invoke

load_dotenv()
invoke('Generate a data model for a risk management application. The risk type should have attributes for the probability and impact of the risk.')
