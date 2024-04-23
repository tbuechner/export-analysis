from dotenv import load_dotenv

from data_model_creator.api import invoke

load_dotenv()
invoke('Generate a data model for a risk management application')
