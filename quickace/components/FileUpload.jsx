import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const FileUpload = () => {
    const router = useRouter();  

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
            sessionStorage.setItem('uploadedFileData', JSON.stringify({
              outline: response.data.outline,
              fullText: response.data.fullText,
            }));
            router.push('/content');
          })
          .catch((error) => {
            console.error(error);
          });
      };
    
      return (
        <div className="absolute inset-0 flex items-center justify-center px-5">
            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-2.5">
              <div className="flex gap-2.5">
                <input 
                  type="file" 
                  className="flex-1 bg-white/10 border-none p-2.5 rounded text-white outline-none placeholder-white/50"
                  onChange={handleFileChange}
                />
                <Link href="/content">
                  <button className="bg-[#a3a0ff33] hover:bg-[#a3a0ff4d] w-10 h-10 rounded flex items-center justify-center text-white transition-colors duration-300 text-2xl font-bold">
                    +
                  </button>
                </Link>
              </div>
            </div>
          </div>
      );
}

export default FileUpload;