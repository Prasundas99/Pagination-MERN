import  { useState } from 'react';
import axios from 'axios';

const AddPostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.REACT_APP_API_URL}/add/post`, { title, content });
      setMessage(response.data.message);
      setTitle('');
      setContent('');
    } catch (error) {
        console.log(error)
      setMessage('Error adding post.');
    }
  };

  return (
    <div>
      <h1>Add Post</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Content" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
        />
        <button type="submit">Add Post</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddPostPage;
