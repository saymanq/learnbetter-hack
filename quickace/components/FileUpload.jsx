import axios from 'axios';

const FileUpload = () => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        console.log(formData);
    
        axios.post('http://127.0.0.1:7000/api/upload-pdf', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }})
          .then((response) => {
            console.log(response.data); // extracted data
          })
          .catch((error) => {
            console.error(error);
          });
      };
    
      return (
        <div>
          <input type="file" onChange={handleFileChange} />
        </div>
      );
}

export default FileUpload;