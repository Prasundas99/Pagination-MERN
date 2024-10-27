import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card/Card';
import { API_URL } from '../utils/constants';

const OffsetPagination = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  console.log(API_URL)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const api = axios.create({
          baseURL: API_URL,
        });

        const response = await api.get('/offset-based-pagination', {
          params: { page }
        });
        setPosts(response.data.data.posts);
        setTotalPages(response.data.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.log(error)
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <h1>Paginated Posts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {posts?.map((post) => (
            <li key={post._id}>
                <Card title={post.title} content={post.content} />
            </li>
          ))}
        </ul>
      )}
      <button 
        onClick={() => handlePageChange(page - 1)} 
        disabled={page === 1}
      >
        Previous
      </button>
      <button 
        onClick={() => handlePageChange(page + 1)} 
        disabled={page === totalPages}
      >
        Next
      </button>
      <p>Page {page} of {totalPages}</p>
    </div>
  );
};

export default OffsetPagination;
