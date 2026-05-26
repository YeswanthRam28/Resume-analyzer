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
    def parse_svg_local(file_content: bytes) -> str:
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
    async def parse_svg_with_gemini(file_content: bytes, filename: str) -> str:
        import tempfile
        from google import genai
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or "your_gemini_api_key" in api_key:
            return ParserService.parse_svg_local(file_content)
            
        client = genai.Client(api_key=api_key)
        
        def _upload_and_extract():
            with tempfile.NamedTemporaryFile(suffix=".svg", delete=False) as tmp:
                tmp.write(file_content)
                tmp_path = tmp.name
                
            try:
                svg_file = client.files.upload(file=tmp_path)
                
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=[
                        svg_file,
                        "Extract all text exactly from this SVG image. Do not include any commentary."
                    ]
                )
                
                try:
                    client.files.delete(name=svg_file.name)
                except:
                    pass
                    
                return response.text
            except Exception as e:
                print(f"Gemini SVG processing failed: {e}. Using local XML parser.")
                return ParserService.parse_svg_local(file_content)
            finally:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
                    
        return await asyncio.to_thread(_upload_and_extract)

    @staticmethod
    async def parse_svg(file_content: bytes, filename: str) -> str:
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key and "your_gemini_api_key" not in api_key:
            try:
                return await ParserService.parse_svg_with_gemini(file_content, filename)
            except Exception as e:
                print(f"Gemini SVG parsing failed: {e}. Falling back to local XML.")
        return ParserService.parse_svg_local(file_content)

    @staticmethod
    def parse_doc_fallback(file_content: bytes) -> str:
        import re
        try:
            decoded = file_content.decode("utf-8", errors="ignore")
            words = re.findall(r'[\x20-\x7E\s]{4,}', decoded)
            cleaned = []
            for w in words:
                w_str = w.strip()
                if not w_str:
                    continue
                # Skip strings containing common binary signatures
                if any(sig in w_str for sig in ["PNG", "IHDR", "IDAT", "JFIF", "Exif", "ActiveX", "Microsoft", "Word.Document", "ObjectPool"]):
                    continue
                # Skip lines that are too long with no spaces (base64 or hex data)
                if len(w_str) > 100 and " " not in w_str:
                    continue
                # Skip lines containing high special character density (e.g. binary junk)
                non_alnum = len(re.sub(r'[a-zA-Z0-9\s]', '', w_str))
                if len(w_str) > 0 and (non_alnum / len(w_str)) > 0.3:
                    continue
                cleaned.append(w_str)
            return "\n".join(cleaned)
        except Exception as e:
            print(f"Fallback .doc parsing error: {e}")
            return ""

    @staticmethod
    async def parse_doc_local_win32(file_content: bytes, filename: str) -> str:
        import tempfile
        try:
            import win32com.client
            import pythoncom
        except ImportError:
            raise ImportError("win32com or pythoncom not installed.")

        def _read_win32():
            pythoncom.CoInitialize()
            ext = os.path.splitext(filename)[1].lower()
            with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
                tmp.write(file_content)
                tmp_path = tmp.name
                
            text = ""
            word = None
            doc = None
            try:
                word = win32com.client.Dispatch("Word.Application")
                word.Visible = False
                word.DisplayAlerts = False
                
                doc = word.Documents.Open(tmp_path)
                text = doc.Content.Text
            except Exception as e:
                print(f"Local win32com Word extraction failed: {e}")
                raise e
            finally:
                if doc:
                    try:
                        doc.Close(False)
                    except:
                        pass
                if word:
                    try:
                        word.Quit()
                    except:
                        pass
                if os.path.exists(tmp_path):
                    try:
                        os.remove(tmp_path)
                    except:
                        pass
                pythoncom.CoUninitialize()
            return text

        return await asyncio.to_thread(_read_win32)

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
    async def parse_image_nvidia_fallback(file_content: bytes, filename: str) -> str:
        import base64
        from openai import AsyncOpenAI
        
        api_key = os.getenv("NVIDIA_API_KEY")
        if not api_key or "your_nvidia_api_key" in api_key:
            raise ValueError("NVIDIA_API_KEY is not configured for fallback OCR.")
            
        client = AsyncOpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=api_key
        )
        
        ext = os.path.splitext(filename)[1].lower()
        mime_type = "image/png" if ext == ".png" else "image/jpeg"
        
        base64_image = base64.b64encode(file_content).decode('utf-8')
        
        print("Using NVIDIA vision fallback (meta/llama-3.2-11b-vision-instruct)...")
        response = await client.chat.completions.create(
            model="meta/llama-3.2-11b-vision-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Extract all text exactly from this resume image. Maintain the layout structure as much as possible. Do not include any conversation, introductions, or formatting markdown other than the extracted text."},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime_type};base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=4096
        )
        return response.choices[0].message.content

    @staticmethod
    async def parse_image(file_content: bytes, filename: str) -> str:
        try:
            from google import genai
            from google.genai import types
            
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key or "your_gemini_api_key" in api_key:
                raise ValueError("GEMINI_API_KEY is not configured or invalid.")
                
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
        except Exception as e:
            print(f"Gemini image parsing failed: {e}. Attempting NVIDIA vision fallback...")
            try:
                return await ParserService.parse_image_nvidia_fallback(file_content, filename)
            except Exception as fallback_err:
                print(f"NVIDIA vision fallback failed: {fallback_err}")
                raise ValueError(f"Both Gemini and NVIDIA Vision image parsing failed. Gemini Error: {str(e)}. NVIDIA Error: {str(fallback_err)}")

    @staticmethod
    async def extract_text(file_content: bytes, filename: str) -> str:
        fn_lower = filename.lower()
        if fn_lower.endswith(".pdf"):
            return await ParserService.parse_pdf(file_content)
        elif fn_lower.endswith(".docx"):
            return await ParserService.parse_docx(file_content)
        elif fn_lower.endswith(".doc"):
            try:
                return await ParserService.parse_doc_local_win32(file_content, filename)
            except Exception as e:
                print(f"Local Word extraction failed for {filename}: {e}. Falling back to Gemini/regex parsing.")
                return await ParserService.parse_doc_with_gemini(file_content, filename)
        elif fn_lower.endswith(".svg"):
            return await ParserService.parse_svg(file_content, filename)
        elif fn_lower.endswith((".png", ".jpg", ".jpeg")):
            return await ParserService.parse_image(file_content, filename)
        else:
            raise ValueError("Unsupported file format. Allowed formats: PDF, DOCX, DOC, SVG, PNG, JPG, JPEG")

