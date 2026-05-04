import mammoth
from pdfminer.high_level import extract_text
import io

class ParserService:
    @staticmethod
    async def parse_pdf(file_content: bytes) -> str:
        with io.BytesIO(file_content) as open_pdf_file:
            text = extract_text(open_pdf_file)
            return text

    @staticmethod
    async def parse_docx(file_content: bytes) -> str:
        with io.BytesIO(file_content) as docx_file:
            result = mammoth.extract_raw_text(docx_file)
            return result.value

    @staticmethod
    async def extract_text(file_content: bytes, filename: str) -> str:
        if filename.endswith(".pdf"):
            return await ParserService.parse_pdf(file_content)
        elif filename.endswith(".docx"):
            return await ParserService.parse_docx(file_content)
        else:
            raise ValueError("Unsupported file format. Only PDF and DOCX are allowed.")
