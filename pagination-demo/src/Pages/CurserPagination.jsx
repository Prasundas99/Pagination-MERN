import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Card from '../components/Card/Card';
import { API_URL } from '../utils/constants';

const InfiniteScrollPage = () => {
  const [state, setState] = useState({
    posts: [],
    lastItemId: '',
    hasMore: true,
    isFromCache: false,
    responseTime: null,
  });
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const startTime = Date.now();
      const response = await axios.get(`${API_URL}/curser-based-pagination?lastItemId=${state.lastItemId}&limit=10`);
      const endTime = Date.now();

      const newPosts = response.data?.posts || [];
      setState((prevState) => ({
        ...prevState,
        posts: [...prevState.posts, ...newPosts],
        lastItemId: response.data?.lastItemId || null,
        hasMore: newPosts.length > 0,
        isFromCache: response.data?.fromCache || false,
        responseTime: endTime - startTime,
      }));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [state.lastItemId]);

  useEffect(() => {
    if (state.hasMore) {
      fetchPosts();
    }
  }, [state.hasMore, fetchPosts]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      if (state.hasMore) {
        setState((prevState) => ({ ...prevState, lastItemId: prevState?.lastItemId }));
      }
    }
  }, [state.hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div>
      <h1>Infinite Scroll OR Cursor Based Paginated Posts</h1>
      <p>Is from cache: {String(state.isFromCache)}</p>
      <p>Response time: {state.responseTime} ms</p>

      <ul>
        {state.posts?.map((post) => (
          <li key={post?._id}>
            <Card title={post?.title} content={post?.content} />
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {!state.hasMore && <p>No more posts</p>}
    </div>
  );
};

export default InfiniteScrollPage;
