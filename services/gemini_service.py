import os
import base64
from dotenv import load_dotenv
from google import genai
from google.genai import types

class GeminiService:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("API_KEY_MISSING")
        self.client = genai.Client(api_key=self.api_key)
        self.model = "gemini-3-flash-preview"

    def extraire_competences(self, base64_data, mime_type="application/pdf"):
        file_bytes = base64.b64decode(base64_data)
        
        prompt = "Analyse ce CV. Extrait uniquement les compétences techniques et le savoir-faire sous forme de liste séparée par des virgules. Ne fais aucune phrase d'introduction."
        
        # On envoie le VRAI fichier à Gemini
        contents = [
            types.Part.from_bytes(data=file_bytes, mime_type=mime_type),
            types.Part.from_text(text=prompt)
        ]
        
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=contents,
                config=types.GenerateContentConfig(temperature=0.1)
            )
            return response.text
        except Exception as e:
            return str(e)