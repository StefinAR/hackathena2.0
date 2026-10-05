from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.pcap_service import save_pcap
from app.services.tshark_service import extract_packets

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)


@router.post("/upload")
async def upload_pcap(
    file: UploadFile = File(...)
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file provided"
        )

    try:
        # 1. Read the uploaded PCAP
        content = await file.read()

        # 2. Save the PCAP
        pcap_path = save_pcap(
            filename=file.filename,
            content=content
        )

        # 3. Give the saved PCAP path to TShark
        packets = extract_packets(pcap_path)

        return {
            "message": "PCAP analyzed successfully",
            "saved_path": str(pcap_path),
            "packet_count": len(packets)
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )