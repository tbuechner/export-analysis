import warnings

from expandPrompts import expand_prompts
from processExport import run_for_folder

# ignore all warnings
warnings.filterwarnings("ignore")

run_for_folder('ws_okr-small')

run_for_folder('ws_okr')

run_for_folder('ws_largeSolutionSAFe')

expand_prompts()







