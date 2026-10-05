# backend/app/routes/analysis.py

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.analysis_service import analyze_pcap


router = APIRouter(
    prefix="/api/analysis",
    tags=["Analysis"],
)


@router.post("/upload")
async def upload_pcap(
    file: UploadFile = File(...)
):
    """
    Upload a PCAP file and analyze it using LUCID.
    """

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected."
        )

    if not file.filename.lower().endswith(
        (".pcap", ".pcapng", ".cap")
    ):
        raise HTTPException(
            status_code=400,
            detail="Only PCAP, PCAPNG, and CAP files are allowed."
        )

    try:

        result = await analyze_pcap(file)

        return result

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    except FileNotFoundError as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc)
        )

    except RuntimeError as exc:

        raise HTTPException(
            status_code=500,
            detail=str(exc)
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(exc)}"
        )