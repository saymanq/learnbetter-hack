from pinecone_rag import PineconeRAG
from dotenv import load_dotenv
import os

load_dotenv()

def write_to_pinecone(user, text):
    rag = PineconeRAG(
        index_name = "test",
        )

    rag.store_document(
    text = text,
    user_id = user
    )
    '''
    query1 = "What is recursion? Give examples."
    results1 = rag.query(query1, user_id='tri123', top_k=2)
    for i, result in enumerate(results1, 1):
        print(f"\nMatch {i}:")
        print(f"Text: {result['text']}")
        print(f"Similarity Score: {result['score']:.3f}")
    '''


def main():
    rag = PineconeRAG(
    api_key=os.getenv('PINECONE_API'),
    environment="gcp-starter",  # or your environment
    index_name="test"
    )

    rag.store_document(
    text=technical_doc,
    user_id=user1_id,
    metadata={
        "document_type": "technical",
        "subject": "machine_learning",
        "date": "2024-11-09"
    }
)

if __name__ == "__main__":
    main()