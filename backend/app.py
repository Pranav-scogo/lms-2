import os
import json
import logging
import pymupdf
from io import BytesIO
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from langchain_openai import AzureChatOpenAI
from langchain.prompts import ChatPromptTemplate

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

prompt_template = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are an AI that creates structured summaries and quiz questions from PDFs. Always return valid JSON.",
        ),
        (
            "user",
            """Analyze this text and return a structured JSON response:
            {{
                "summary": "<Concise summary for this section>",
                "questions": [
                    {{"question": "<question1>", "options": ["<A>", "<B>", "<C>", "<D>"], "correctAnswer": <correct index (0-3)> }},
                    {{"question": "<question2>", "options": ["<A>", "<B>", "<C>", "<D>"], "correctAnswer": <correct index (0-3)> }},
                    {{"question": "<question3>", "options": ["<A>", "<B>", "<C>", "<D>"], "correctAnswer": <correct index (0-3)> }}
                ]
            }}

            Text to analyze: {text}

            Ensure the response is valid JSON. No additional text or markdown.""",
        ),
    ]
)


def clean_llm_response(response_text):
    """Cleans LLM response to ensure valid JSON output."""
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

        pages_text = [page.get_text("text") or "" for page in doc]

        if not any(text.strip() for text in pages_text):
            raise HTTPException(status_code=422, detail="No extractable text found")

        logger.info(f"Extracted {len(pages_text)} pages of text")

        sections = []
        final_summary = []
        final_questions = []

        for page_num, text in enumerate(pages_text, start=1):
            if not text.strip():
                continue

            logger.info(f"Processing page {page_num}")

            attempt = 0
            max_retries = 3
            section_data = None

            while attempt < max_retries:
                try:
                    response = llm.invoke(prompt_template.format_messages(text=text))
                    cleaned_response = clean_llm_response(response.content)

                    section_data = json.loads(cleaned_response)
                    break  
                except Exception as e:
                    attempt += 1
                    logger.error(f"LLM error on page {page_num}, attempt {attempt}: {str(e)}")

            if not section_data:
                logger.warning(f"Skipping page {page_num} due to repeated LLM failures")
                continue

            sections.append({
                "page": page_num,
                "summary": section_data.get("summary", ""),
                "questions": section_data.get("questions", [])
            })

            final_summary.append(section_data.get("summary", ""))
            final_questions.extend(section_data.get("questions", []))

        if not sections:
            raise HTTPException(status_code=500, detail="No valid responses generated")

        unique_questions = []
        seen_questions = set()
        for section in sections:
            for q in section["questions"]:
                if q["question"] not in seen_questions:
                    seen_questions.add(q["question"])
                    unique_questions.append(q)
        
        final_quiz = unique_questions[:10]

        final_result = {
            "sections": sections,
            "final_summary": " ".join(final_summary)[:2000],  
            "final_quiz": final_quiz
        }

        logger.info("Successfully processed PDF")
        return final_result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
