import mammoth
from pdfminer.high_level import extract_text
import io
import os
import asyncio

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
    async def parse_svg(file_content: bytes) -> str:
        import xml.etree.ElementTree as ET
        try:
            root = ET.fromstring(file_content)
            texts = []
            for elem in root.iter():
                tag = elem.tag.split('}')[-1] if '}' in elem.tag else elem.tag
                if tag in ['text', 'tspan'] and elem.text:
                    texts.append(elem.text.strip())
            return "\n".join(texts)
        except Exception as e:
            print(f"Error parsing SVG: {e}")
            return ""

    @staticmethod
    def parse_doc_fallback(file_content: bytes) -> str:
        import re
        try:
            decoded = file_content.decode("utf-8", errors="ignore")
            words = re.findall(r'[\x20-\x7E\s]{4,}', decoded)
            cleaned = []
            for w in words:
                w_str = w.strip()
                if w_str and not all(c in "!@#$%^&*()_+=-`~[]\\{}|;':\",./<>?" for c in w_str):
                    cleaned.append(w_str)
            return "\n".join(cleaned)
        except Exception as e:
            print(f"Fallback .doc parsing error: {e}")
            return ""

    @staticmethod
    async def parse_doc_with_gemini(file_content: bytes, filename: str) -> str:
        import tempfile
        from google import genai
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or "your_gemini_api_key" in api_key:
            print("GEMINI_API_KEY not configured. Falling back to local doc text extraction.")
            return ParserService.parse_doc_fallback(file_content)
            
        client = genai.Client(api_key=api_key)
        
        def _upload_and_extract():
            ext = os.path.splitext(filename)[1].lower()
            with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
                tmp.write(file_content)
                tmp_path = tmp.name
                
            try:
                doc_file = client.files.upload(file=tmp_path)
                
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=[
                        doc_file,
                        "Extract all text exactly from this resume document. Do not include any commentary."
                    ]
                )
                
                try:
                    client.files.delete(name=doc_file.name)
                except:
                    pass
                    
                return response.text
            except Exception as e:
                print(f"Gemini .doc processing failed: {e}. Using fallback.")
                return ParserService.parse_doc_fallback(file_content)
            finally:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
                    
        return await asyncio.to_thread(_upload_and_extract)

    @staticmethod
    async def parse_image(file_content: bytes, filename: str) -> str:
        from google import genai
        from google.genai import types
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or "your_gemini_api_key" in api_key:
            raise ValueError("GEMINI_API_KEY is not configured. Image parsing requires a valid Gemini API Key.")
            
        client = genai.Client(api_key=api_key)
        ext = os.path.splitext(filename)[1].lower()
        mime_type = "image/png" if ext == ".png" else "image/jpeg"
        
        def _call_gemini():
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=[
                    types.Part.from_bytes(
                        data=file_content,
                        mime_type=mime_type
                    ),
                    "Extract all text exactly from this resume image. Maintain the layout structure as much as possible. Do not include any conversation, introductions, or formatting markdown other than the extracted text."
                ]
            )
            return response.text
            
        text = await asyncio.to_thread(_call_gemini)
        return text

    @staticmethod
    async def extract_text(file_content: bytes, filename: str) -> str:
        fn_lower = filename.lower()
        if fn_lower.endswith(".pdf"):
            return await ParserService.parse_pdf(file_content)
        elif fn_lower.endswith(".docx"):
            return await ParserService.parse_docx(file_content)
        elif fn_lower.endswith(".doc"):
            return await ParserService.parse_doc_with_gemini(file_content, filename)
        elif fn_lower.endswith(".svg"):
            return await ParserService.parse_svg(file_content)
        elif fn_lower.endswith((".png", ".jpg", ".jpeg")):
            return await ParserService.parse_image(file_content, filename)
        else:
            raise ValueError("Unsupported file format. Allowed formats: PDF, DOCX, DOC, SVG, PNG, JPG, JPEG")

