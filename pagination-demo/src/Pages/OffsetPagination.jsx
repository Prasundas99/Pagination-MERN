import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card/Card';
import { API_URL } from '../utils/constants';

const OffsetPagination = () => {
  const [state, setState] = useState({
    posts: [],
    page: 1,
    totalPages: 1,
    responseTime: null,
    isFromCache: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const startTime = Date.now();

        const response = await axios.get(`${API_URL}/offset-based-pagination`, {
          params: { page: state.page },
        });

        const endTime = Date.now();
        
        setState((prevState) => ({
          ...prevState,
          posts: response.data.data.posts,
          totalPages: response.data.data.totalPages,
          responseTime: endTime - startTime,
          isFromCache: response.data.data.fromCache,
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [state.page]);

  const handlePageChange = (newPage) => {
    setState((prevState) => ({
      ...prevState,
      page: newPage,
    }));
  };

  return (
    <div>
      <h1>Paginated Posts</h1>
      <p>Response time: {state.responseTime} ms</p>
      <p>Is from cache: {String(state.isFromCache)}</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {state.posts?.map((post) => (
            <li key={post._id}>
              <Card title={post.title} content={post.content} />
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => handlePageChange(state.page - 1)} disabled={state.page === 1}>
        Previous
      </button>
      <button onClick={() => handlePageChange(state.page + 1)} disabled={state.page === state.totalPages}>
        Next
      </button>
      <p>Page {state.page} of {state.totalPages}</p>
    </div>
  );
};

export default OffsetPagination;
