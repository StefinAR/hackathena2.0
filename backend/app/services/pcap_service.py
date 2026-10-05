from pathlib import Path
import uuid


UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


def save_pcap(filename: str, content: bytes):

    extension = Path(filename).suffix.lower()

    if extension not in [".pcap", ".pcapng"]:
        raise ValueError(
            "Only .pcap and .pcapng files are supported"
        )

    new_filename = f"{uuid.uuid4()}{extension}"

    file_path = UPLOAD_DIR / new_filename

    file_path.write_bytes(content)

    return file_path