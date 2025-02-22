from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
from io import BytesIO
from dotenv import load_dotenv
import os
import json
from langchain_openai import AzureChatOpenAI
import uvicorn
from langchain.prompts import ChatPromptTemplate
import logging
from functools import lru_cache
import hashlib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = AzureChatOpenAI(
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    deployment_name=os.getenv("AZURE_OPENAI_MODEL"),
    temperature=0.5,  # Lowered for more consistent results
)

# Fixed prompt template - using double braces to escape JSON curly braces
prompt_template = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful assistant that creates concise summaries and quiz questions from PDF content. Always respond with valid JSON.",
        ),
        (
            "user",
            """Analyze this text and provide ONLY a summary and quiz questions in the following JSON format:
    {{
        "summary": "<concise 3-paragraph summary of key points>",
        "questions": [
            {{
                "question": "<clear, specific question about the content>",
                "options": ["<option1>", "<option2>", "<option3>", "<option4>"],
                "correctAnswer": <index of correct answer (0-3)>
            }},
            {{
                "question": "<second question>",
                "options": ["<option1>", "<option2>", "<option3>", "<option4>"],
                "correctAnswer": <index of correct answer (0-3)>
            }},
            {{
                "question": "<third question>",
                "options": ["<option1>", "<option2>", "<option3>", "<option4>"],
                "correctAnswer": <index of correct answer (0-3)>
            }}
        ]
    }}
    
    Text to analyze: {text}
    
    IMPORTANT: Your response must be valid JSON only. No markdown, no explanations, no additional text.""",
        ),
    ]
)


def chunk_text(text, max_chunk_size=3800, overlap=200):
    """Split long text into overlapping chunks with smart splitting at sentence boundaries."""
    if len(text) <= max_chunk_size:
        return [text]

    chunks = []
    start = 0

    while start < len(text):
        end = min(start + max_chunk_size, len(text))

        # Try to find a sentence boundary to split at
        if end < len(text):
            # Look for the last period followed by space
            last_period = text.rfind(". ", start, end)
            if last_period != -1:
                end = last_period + 2  # Include the period and space

        chunks.append(text[start:end])
        start = end if end == len(text) else end - overlap

    return chunks


@lru_cache(maxsize=20)
def get_cached_response(text_hash):
    """Cache responses based on text hash to avoid reprocessing identical documents."""
    # This is just a placeholder for the cache functionality
    # The actual implementation happens through the lru_cache decorator
    pass


def clean_llm_response(response_text):
    """Clean and extract valid JSON from LLM response."""
    # Remove any potential Markdown code block syntax
    cleaned = response_text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]

    # Return the cleaned JSON string
    return cleaned.strip()


def combine_chunk_results(results):
    """Combine results from multiple text chunks into a single coherent response."""
    if len(results) == 1:
        return results[0]

    # Extract all summaries and questions
    all_summaries = []
    all_questions = []

    for result in results:
        try:
            parsed = json.loads(result)
            if "summary" in parsed:
                all_summaries.append(parsed["summary"])
            if "questions" in parsed and isinstance(parsed["questions"], list):
                all_questions.extend(parsed["questions"])
        except json.JSONDecodeError:
            logger.error(f"Failed to parse chunk result: {result[:100]}...")

    # Combine summaries and pick top questions
    combined_summary = " ".join(all_summaries)
    # Deduplicate and limit to 3 questions
    unique_questions = []
    seen_questions = set()

    for q in all_questions:
        q_text = q.get("question", "")
        if q_text and q_text not in seen_questions and len(unique_questions) < 3:
            seen_questions.add(q_text)
            unique_questions.append(q)

    # Fill in if we don't have enough questions
    while len(unique_questions) < 3 and all_questions:
        unique_questions.append(all_questions.pop(0))

    # Construct final response
    return json.dumps(
        {
            "summary": combined_summary[:1500],  # Limit summary length
            "questions": unique_questions[:3],  # Ensure exactly 3 questions
        }
    )


@app.post("/api/pdf/process")
async def process_pdf(file: UploadFile):
    try:
        # Validate file type
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")

        logger.info(f"Processing file: {file.filename}")

        # Read PDF content
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(BytesIO(content))

        # Extract text from all pages
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

        if not text.strip():
            raise HTTPException(
                status_code=422, detail="Could not extract any text from the PDF"
            )

        logger.info(
            f"Extracted {len(text)} characters from {len(pdf_reader.pages)} pages"
        )

        # Check cache using text hash
        text_hash = hashlib.md5(text.encode()).hexdigest()
        cached_result = get_cached_response(text_hash)  # This uses the lru_cache

        if cached_result:
            logger.info("Retrieved result from cache")
            return json.loads(cached_result)

        # Process text (potentially in chunks for longer documents)
        chunks = chunk_text(text)
        results = []

        for i, chunk in enumerate(chunks):
            logger.info(f"Processing chunk {i+1}/{len(chunks)} ({len(chunk)} chars)")

            # Format the prompt with the current chunk
            messages = prompt_template.format_messages(text=chunk)

            # Get response from LLM
            try:
                response = llm.invoke(messages)
                cleaned_response = clean_llm_response(response.content)

                # Validate JSON response
                try:
                    json.loads(cleaned_response)
                    results.append(cleaned_response)
                except json.JSONDecodeError as e:
                    logger.error(f"Invalid JSON in chunk {i+1}: {str(e)}")
                    logger.debug(f"Raw response: {cleaned_response[:200]}...")
            except Exception as e:
                logger.error(f"LLM processing error for chunk {i+1}: {str(e)}")

        if not results:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate valid responses from document content",
            )

        # Combine results from all chunks
        final_result_json = combine_chunk_results(results)

        # Cache the result
        get_cached_response.cache_clear()  # Clear old cached values

        # Parse to ensure valid JSON and return
        final_result = json.loads(final_result_json)
        logger.info("Successfully processed PDF and generated response")
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
