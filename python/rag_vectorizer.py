import os
import json
import pinecone
import openai
from tqdm import tqdm
from dotenv import load_dotenv
from uuid import uuid4

def get_embedding(text: str, model: str = "text-embedding-ada-002") -> list:
    text = text.replace("\n", " ")
    response = openai.Embedding.create(input=[text], model=model)
    return response['data'][0]['embedding']

# Load API keys
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
pinecone.init(api_key=os.getenv("PINECONE_API_KEY"), environment=os.getenv("PINECONE_ENV"))

# Create index if not exists
index_name = "job-remark-index"
if index_name not in pinecone.list_indexes():
    pinecone.create_index(index_name, dimension=1536)

index = pinecone.Index(index_name)

# Load job data
with open('data/scored_jobs_output.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)

# Generate and upload embeddings
def prepare_and_upload_embeddings():
    for job in tqdm(jobs):
        content = f"{job.get('title', '')}\n{job.get('descriptionText', '')}"
        embedding = get_embedding(content, engine="text-embedding-ada-002")

        index.upsert([
            (str(uuid4()), {
                "metadata": {
                    "id": job["id"],
                    "title": job.get("title", ""),
                    "tier": job.get("tier", ""),
                    "score": job.get("final_score", 0),
                },
                "values": embedding
            })
        ])

if __name__ == "__main__":
    prepare_and_upload_embeddings()
