import warnings

from expandPrompts import expand_prompts
from processExport import run_for_folder

# ignore all warnings
warnings.filterwarnings("ignore")

run_for_folder('okr-small')

run_for_folder('okr')

run_for_folder('largeSolutionSAFe')

expand_prompts()







