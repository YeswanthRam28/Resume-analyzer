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
    async def parse_svg(file_content: bytes, filename: str) -> str:
        # Fallback to local parsing without AI
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
        import shutil
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
            images = []
            word = None
            doc = None
            try:
                word = win32com.client.Dispatch("Word.Application")
                word.Visible = False
                word.DisplayAlerts = False
                
                doc = word.Documents.Open(tmp_path)
                text = doc.Content.Text
                
                # Check if the extracted text is empty or extremely short/junk
                # and contains inline shapes/objects
                cleaned_text = text.replace('\r', '').replace('\n', '').strip() if text else ""
                if len(cleaned_text) < 50 and doc.InlineShapes.Count > 0:
                    print(f"Text in {filename} is too short ({len(cleaned_text)} chars). InlineShapes found. Saving as HTML to extract images...")
                    temp_dir = tempfile.mkdtemp()
                    html_path = os.path.join(temp_dir, "doc.html")
                    doc.SaveAs2(html_path, FileFormat=10) # wdFormatFilteredHTML = 10
                    
                    # Read the extracted files
                    files_dir = os.path.join(temp_dir, "doc_files")
                    if os.path.exists(files_dir):
                        for f in sorted(os.listdir(files_dir)):
                            f_lower = f.lower()
                            if f_lower.endswith((".jpg", ".jpeg", ".png", ".gif", ".emf", ".wmf")):
                                img_path = os.path.join(files_dir, f)
                                try:
                                    with open(img_path, "rb") as img_file:
                                        images.append(img_file.read())
                                except Exception as img_err:
                                    print(f"Failed to read image {f}: {img_err}")
                    try:
                        shutil.rmtree(temp_dir)
                    except:
                        pass
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
            return text, images

        text, images = await asyncio.to_thread(_read_win32)
        
        # If text is empty/short but we extracted images, run OCR on the images
        cleaned_text = text.replace('\r', '').replace('\n', '').strip() if text else ""
        if len(cleaned_text) < 50 and images:
            print(f"Running OCR/Vision parser on {len(images)} extracted image(s) from {filename}...")
            ocr_texts = []
            for i, img_bytes in enumerate(images, 1):
                try:
                    ocr_text = await ParserService.parse_image(img_bytes, f"extracted_{i}_{filename}.png")
                    if ocr_text:
                        ocr_texts.append(ocr_text)
                except Exception as ocr_err:
                    print(f"Failed to parse extracted image {i} from {filename}: {ocr_err}")
            if ocr_texts:
                return "\n\n".join(ocr_texts)
                
        return text

    @staticmethod
    async def parse_image(file_content: bytes, filename: str) -> str:
        import base64
        from openai import AsyncOpenAI
        
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key or "your_openrouter_api_key" in api_key:
            raise ValueError("OPENROUTER_API_KEY is not configured for image parsing.")
            
        client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key
        )
        
        ext = os.path.splitext(filename)[1].lower()
        mime_type = "image/png" if ext == ".png" else "image/jpeg"
        
        base64_image = base64.b64encode(file_content).decode('utf-8')
        
        try:
            response = await client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
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
        except Exception as e:
            print(f"Image parsing failed with OpenRouter: {e}")
            raise

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
                print(f"Local Word extraction failed for {filename}: {e}. Falling back to regex parsing.")
                return ParserService.parse_doc_fallback(file_content)
        elif fn_lower.endswith(".svg"):
            return await ParserService.parse_svg(file_content, filename)
        elif fn_lower.endswith((".png", ".jpg", ".jpeg")):
            return await ParserService.parse_image(file_content, filename)
        else:
            raise ValueError("Unsupported file format. Allowed formats: PDF, DOCX, DOC, SVG, PNG, JPG, JPEG")

