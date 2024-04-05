import warnings

from expandPrompts import expand_prompts
from processPkg import process_pkg, generate_pkgs
from processExport import process_ws_export

# ignore all warnings
warnings.filterwarnings("ignore")

process_pkg('pkg_okr')

# process_ws_export('ws_okr-small')
# process_ws_export('ws_okr')
# process_ws_export('ws_largeSolutionSAFe')

generate_pkgs()

expand_prompts()







