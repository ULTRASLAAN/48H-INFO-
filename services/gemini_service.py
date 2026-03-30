import os
import google.generativeai as genai
from dotenv import load_dotenv

class GeminiService:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("API_KEY_MISSING")
            
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def generer_resume_profil(self, competences):
        prompt = f"Rédige un résumé professionnel court pour un étudiant avec ces compétences : {competences}"
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return str(e)