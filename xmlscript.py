import warnings

from utils import run_for_folder
from expandPrompts import expand_prompts

# ignore all warnings
warnings.filterwarnings("ignore")

run_for_folder('okr-small')

run_for_folder('okr')

run_for_folder('largeSolutionSAFe')

expand_prompts()







