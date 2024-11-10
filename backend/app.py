# app.py
from flask import Flask, request, jsonify
from pinecone_rag import PineconeRAG
from langgraph_rag import llm_output
from index import write_to_pinecone
from flask_cors import CORS
from dotenv import load_dotenv
import pdfplumber
import os

load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route('/api/upload-pdf', methods=['POST'])
def upload_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            

        with pdfplumber.open('uploaded.pdf') as pdf:
            pages = pdf.pages
            extracted_data = []
            for page in pages:
                extracted_data.append(page.extract_text())
        full_text = '\n'.join(extracted_data)

        write_to_pinecone('qwerty', full_text)
        llm_response = llm_output(f"'response_format': 'Create an structured outline that shows: - Main topics - Subtopics - Key points under each. Use clear hierarchical structure. It is like a summary. Give output only in markdown format', 'input': {full_text}")
        return jsonify({
            'outline': llm_response,
            'fullText': full_text
        })
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        print(data)
        if not data or 'text' not in data:
            print(jsonify(f"hii"))
            return jsonify({'error': 'No text provided'}), 400
            
        prompt = 'You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards. Both front and back should be one sentence long. You respond only in JSON format. Your response should always be a valid JSON object. Everything should be wrapped in the JSON object exactly like the example given. The front should be in form of a question and the back should be its answer. You should return in the following JSON format: {"flashcards":[{"front": "Front of the card","back": "Back of the card","flip": false}]}'
        
        print(f"Starting out")
        llm_response = llm_output(f"{prompt} Create flashcards for this text: {data['text']}")
        print(f"Got response")
        print(jsonify(llm_response))
        return jsonify(llm_response)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/feedback', methods=['POST'])
def feedback():
    try:
        data = request.get_json()
        question = data['question']
        user_answer = data['answer']
        user_id = data['user_id']

        # Initialize Pinecone RAG
        rag = PineconeRAG(index_name="test")

        # Query context from Pinecone
        relevant_contexts = rag.query(question, user_id=user_id, top_k=3)
        context_text = " ".join([ctx['text'] for ctx in relevant_contexts])

        # Construct prompt for LLM
        prompt = f"""
        Question: {question}
        User's Answer: {user_answer}
        Context: {context_text}

        Task: Compare the user's answer with the context and provide feedback.
        1. If the answer is correct, acknowledge it and suggest one improvement based on the context.
        2. If the answer is incorrect, explain what was wrong and provide the relevant correct information from the context.
        Answer is 2nd person as though you are interacting with the user directly.
        
        Provide only a 1-2 sentence response. No additional formatting or explanations.
        """

        feedback = llm_output(prompt)[0]  # Get first element since llm_output returns a list

        return jsonify({"message": feedback})

    except Exception as e:
        print(f"Error in feedback endpoint: {str(e)}")
        return jsonify({"error": "Failed to generate feedback"}), 500

@app.route('/api/test', methods=['GET'])
def test():
    return "woRKING"
    #return llm_output('{"response_format": "Structure the summary with clear sections and bullet points where appropriate and topics and subtopics. Return the response only in JSON format.", "input": "Explain how the internet works."}')        

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)