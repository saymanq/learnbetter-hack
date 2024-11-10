from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
import torch
import uuid
from typing import List, Dict
from dotenv import load_dotenv
import os
load_dotenv()

class PineconeRAG:
    def __init__(self, 
                 index_name: str,
                 cloud: str = 'aws',           # 'aws' or 'gcp'
                 region: str = 'us-east-1',    # e.g., 'us-west-2', 'us-east-1', etc.
                 serverless: bool = True):
        # Initialize Pinecone
        self.pc = Pinecone(api_key=os.getenv('PINECONE_API'))
        
        # Create index if it doesn't exist
        if index_name not in self.pc.list_indexes().names():
            spec = ServerlessSpec(
                    cloud=cloud,
                    region=region
                )
            
            self.pc.create_index(
                name=index_name,
                dimension=384,  # Using 384 for all-MiniLM-L6-v2
                metric='cosine',
                spec = spec
            )
        
        self.index = self.pc.Index(index_name)
        # Initialize the embedding model
        self.encoder = SentenceTransformer('all-MiniLM-L6-v2')

    def process_text(self, text: str, chunk_size: int = 500) -> List[str]:
        """Split text into chunks"""
        words = text.split()
        chunks = []
        current_chunk = []
        current_length = 0
        
        for word in words:
            current_length += len(word) + 1  # +1 for space
            if current_length > chunk_size:
                chunks.append(' '.join(current_chunk))
                current_chunk = [word]
                current_length = len(word)
            else:
                current_chunk.append(word)
                
        if current_chunk:
            chunks.append(' '.join(current_chunk))
            
        return chunks

    def store_document(self, text: str, user_id: str):
        """Store document chunks with user-specific namespace"""
        # Process text into chunks
        chunks = self.process_text(text)
        
        # Prepare vectors for upload
        vectors = []
        for i, chunk in enumerate(chunks):
            # Generate embedding
            embedding = self.encoder.encode(chunk)
            
            # Create vector ID using user_id and chunk number
            vector_id = f"{user_id}_{uuid.uuid4()}"
            
            # Prepare metadata
            chunk_metadata = {
                "text": chunk,
                "user_id": user_id,
                "chunk_index": i
            }
            
            # Add to vectors list
            vectors.append((vector_id, embedding.tolist(), chunk_metadata))
        print('Processing')
        # Upsert vectors in batches
        batch_size = 100
        for i in range(0, len(vectors), batch_size):
            batch = vectors[i:i + batch_size]
            self.index.upsert(vectors=batch)

    def query(self, query_text: str, user_id: str, top_k: int = 3) -> List[Dict]:
        """Query the index for relevant context, filtered by user_id"""
        # Generate query embedding
        query_embedding = self.encoder.encode(query_text)
        
        # Query Pinecone with user_id filter
        results = self.index.query(
            vector=query_embedding.tolist(),
            top_k=top_k,
            filter={"user_id": user_id},
            include_metadata=True
        )
        
        # Extract and return relevant contexts
        contexts = []
        for match in results.matches:
            contexts.append({
                "text": match.metadata["text"],
                "score": match.score
            })
            
        return contexts

    def delete_user_data(self, user_id: str):
        """Delete all vectors associated with a specific user"""
        self.index.delete(filter={"user_id": user_id})