import os
import json
import logging
import pymupdf
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from langchain_openai import AzureChatOpenAI
from langchain.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home route
@app.get("/")
def home():
    return {"message": "FastAPI is running!"}

# Azure OpenAI API settings
GPT4O_MINI_ENDPOINT = os.getenv("AZURE_OPENAI_GPT4O_MINI_ENDPOINT")
GPT4O_MINI_API_VERSION = os.getenv("AZURE_OPENAI_GPT4O_MINI_API_VERSION")
GPT4O_MINI_API_KEY = os.getenv("AZURE_OPENAI_GPT4O_MINI_API_KEY")
GPT4O_MINI_DEPLOYMENT = os.getenv("AZURE_OPENAI_GPT4O_MINI_DEPLOYMENT")

llm = AzureChatOpenAI(
    api_version=GPT4O_MINI_API_VERSION,
    azure_endpoint=GPT4O_MINI_ENDPOINT,
    api_key=GPT4O_MINI_API_KEY,
    deployment_name=GPT4O_MINI_DEPLOYMENT,
    temperature=0.5,
)

# Prompt Template
prompt_template = ChatPromptTemplate.from_messages([
    ("system", """You are an AI that analyzes educational content and creates structured learning modules. 
    Each module should be based on key concepts identified in the content, with its own quiz section. 
    Finally, create a comprehensive summary and final quiz covering all modules. Always return valid JSON."""),
    ("user", """Analyze this educational content and return a structured JSON response with learning modules organized by key concepts:
    {{
        "modules": [
            {{
                "module_name": "<Module name derived from key concept>",
                "key_concepts": ["<main concept>", "<related concept 1>", "<related concept 2>","<related concept 3>"],
                "learning_objectives": ["<objective 1>", "<objective 2>"],
                "content_summary": "<Detailed summary of this module's content>",
                "section_quiz": [
                    {{
                        "question": "<question specific to this module>",
                        "options": ["A", "B", "C", "D"],
                        "correctAnswer": <correct index (0-3)>,
                        "explanation": "<explanation of the correct answer>"
                    }},
                    {{
                        "question": "<another module-specific question>",
                        "options": ["A", "B", "C", "D"],
                        "correctAnswer": <correct index (0-3)>,
                        "explanation": "<explanation of the correct answer>"
                    }}
                ]
            }}
        ],
        "comprehensive_summary": "<Detailed overview connecting all modules and key concepts>",
        "final_quiz": [
            {{
                "question": "<comprehensive question covering multiple modules>",
                "options": ["A", "B", "C", "D"],
                "correctAnswer": <correct index (0-3)>,
                "explanation": "<explanation of the correct answer>",
                "related_modules": ["<module names this question relates to>"]
            }},
            {{
                "question": "<another comprehensive question>",
                "options": ["A", "B", "C", "D"],
                "correctAnswer": <correct index (0-3)>,
                "explanation": "<explanation of the correct answer>",
                "related_modules": ["<module names this question relates to>"]
            }}
        ]
    }}

    Content to analyze: {text}

    Ensure the response is valid JSON. Create modules based on the main concepts, with each module having its own focused quiz.
    The final quiz should test understanding across multiple modules. No additional text or markdown."""),
])

# Function to clean JSON responses
def clean_llm_response(response_text):
    cleaned = response_text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return cleaned.strip()

@app.post("/process-pdf")
async def process_pdf(file: UploadFile):
    try:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")

        logger.info(f"Processing file: {file.filename}")

        content = await file.read()
        doc = pymupdf.open(stream=content, filetype="pdf")

        # Extract text from all pages and combine
        full_text = ""
        for page in doc:
            text = page.get_text("text") or ""
            full_text += text + "\n"

        if not full_text.strip():
            raise HTTPException(status_code=422, detail="No extractable text found")

        logger.info("Extracted full text from PDF")

        # Process the entire content at once
        attempt = 0
        max_retries = 3
        processed_data = None

        while attempt < max_retries:
            try:
                response = llm.invoke(prompt_template.format(text=full_text))
                cleaned_response = clean_llm_response(response.content)
                processed_data = json.loads(cleaned_response)
                break
            except json.JSONDecodeError:
                attempt += 1
                logger.error(f"JSON decoding error, attempt {attempt}")
            except Exception as e:
                attempt += 1
                logger.error(f"LLM error, attempt {attempt}: {str(e)}")

        if not processed_data:
            raise HTTPException(status_code=500, detail="Failed to process PDF content")

        # Ensure we have at least one module and final quiz
        if not processed_data.get("modules"):
            raise HTTPException(status_code=500, detail="No modules generated from content")
        if not processed_data.get("final_quiz"):
            raise HTTPException(status_code=500, detail="No final quiz generated")

        # Validate module structure
        for idx, module in enumerate(processed_data["modules"]):
            if not module.get("key_concepts"):
                logger.warning(f"Module {idx + 1} missing key concepts")
            if not module.get("section_quiz"):
                logger.warning(f"Module {idx + 1} missing section quiz")

        logger.info("Successfully processed PDF and generated modules with quizzes")
        return processed_data

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
