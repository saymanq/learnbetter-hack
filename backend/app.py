# app.py
from flask import Flask, request, jsonify
from pinecone_rag import PineconeRAG
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
            
        file.save('uploaded.pdf')

        with pdfplumber.open('uploaded.pdf') as pdf:
            pages = pdf.pages
            extracted_data = []
            for page in pages:
                extracted_data.append(page.extract_text())
        full_text = '\n'.join(extracted_data)

        write_to_pinecone('qwerty', full_text)

        '''
        rag = PineconeRAG(
        index_name = "test",
        )

        print(f"Started storing data")
        rag.store_document(
        text = full_text,
        user_id = 'tri123'
        )
        print(f"Finished storing data")

        print(f"Started querying data")
        query1 = "What is recursion? Give examples."
        results1 = rag.query(query1, user_id='tri123', top_k=2)
        for i, result in enumerate(results1, 1):
            print(f"\nMatch {i}:")
            print(f"Text: {result['text']}")
            print(f"Similarity Score: {result['score']:.3f}")
        '''
        


        return jsonify({'data': extracted_data})
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat')
    

@app.route('/api/test', methods=['GET'])
def test():
    return "Working"

if __name__ == '__main__':
    app.run(debug=os.getenv('DEBUG'), port=7000)