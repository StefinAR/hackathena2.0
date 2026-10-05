# backend/app/services/lucid_service.py

import subprocess
from pathlib import Path


# -------------------------------------------------------------------
# Paths
# -------------------------------------------------------------------

BACKEND_DIR = Path(__file__).resolve().parents[2]

# Change this if your lucid_cnn.py is somewhere else.
LUCID_DIR = BACKEND_DIR

LUCID_SCRIPT = LUCID_DIR / "lucid_cnn.py"

MODEL_PATH = BACKEND_DIR / "models" / "netshield.h5"


# -------------------------------------------------------------------
# Run LUCID
# -------------------------------------------------------------------

def run_lucid(pcap_path: Path) -> dict:
    """
    Run LUCID on a PCAP file using the trained NetShield model.

    Equivalent command:

        python lucid_cnn.py \
            --predict_live <pcap> \
            --model models/netshield.h5 \
            --dataset_type DOS2019
    """

    if not pcap_path.exists():
        raise FileNotFoundError(
            f"PCAP file does not exist: {pcap_path}"
        )

    if not LUCID_SCRIPT.exists():
        raise FileNotFoundError(
            f"lucid_cnn.py not found at: {LUCID_SCRIPT}"
        )

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found at: {MODEL_PATH}"
        )

    command = [
        "python",
        str(LUCID_SCRIPT),
        "--predict_live",
        str(pcap_path),
        "--model",
        str(MODEL_PATH),
        "--dataset_type",
        "DOS2019",
    ]

    try:
        result = subprocess.run(
            command,
            cwd=str(LUCID_DIR),
            capture_output=True,
            text=True,
            timeout=300,
        )

    except subprocess.TimeoutExpired:
        raise RuntimeError(
            "LUCID analysis timed out after 5 minutes."
        )

    if result.returncode != 0:
        raise RuntimeError(
            "LUCID failed.\n\n"
            f"STDOUT:\n{result.stdout}\n\n"
            f"STDERR:\n{result.stderr}"
        )

    return parse_lucid_output(result.stdout)


# -------------------------------------------------------------------
# Parse LUCID output
# -------------------------------------------------------------------

def parse_lucid_output(output: str) -> dict:
    """
    Extract the dictionary printed by LUCID.

    Example LUCID output:

    {'Model': 'DOS2019-LUCID',
     'Time': '0.051',
     'Packets': 919,
     'Samples': 167,
     'DDOS%': '0.311',
     'Accuracy': 'N/A',
     'F1Score': 'N/A',
     'TPR': 'N/A',
     'FPR': 'N/A',
     'TNR': 'N/A',
     'FNR': 'N/A',
     'Source': 'example.pcap'}
    """

    import ast

    # Search from the bottom because LUCID can print
    # other information before the final result.
    lines = output.strip().splitlines()

    for line in reversed(lines):
        line = line.strip()

        if line.startswith("{") and line.endswith("}"):
            try:
                parsed = ast.literal_eval(line)

                if isinstance(parsed, dict):
                    return parsed

            except (ValueError, SyntaxError):
                continue

    raise RuntimeError(
        "Could not find a valid LUCID result in its output.\n\n"
        f"LUCID output:\n{output}"
    )