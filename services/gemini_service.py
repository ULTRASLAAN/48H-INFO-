import os
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

    def generer_resume_profil(self, competences):
        prompt = f"Rédige un résumé professionnel court pour un étudiant avec ces compétences : {competences}"
        
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=prompt),
                ],
            ),
        ]
        
        tools = [
            types.Tool(googleSearch=types.GoogleSearch()),
        ]
        
        generate_content_config = types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(
                thinking_level="HIGH",
            ),
            tools=tools,
        )

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=contents,
                config=generate_content_config,
            )
            return response.text
        except Exception as e:
            return str(e)