import  { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card/Card';
import { API_URL } from '../utils/constants';

const InfiniteScrollPage = () => {
  const [posts, setPosts] = useState([]);
  const [lastItemId, setLastItemId] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/curser-based-pagination?lastItemId=${lastItemId}&limit=10`);
        const newPosts = response.data.data.posts;
        setPosts((prev) => [...prev, ...newPosts]);
        setLastItemId(response.data.data.lastItemId);
        setHasMore(newPosts.length > 0);
        setLoading(false);
      } catch (error) {
        console.log(error)
        setLoading(false);
      }
    };

    if (hasMore) {
      fetchPosts();
    }
  }, [hasMore, lastItemId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      if (hasMore) setLastItemId((prevId) => prevId);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, hasMore]);

  return (
    <div>
      <h1>Infinite Scroll Posts</h1>
      <ul>
        {posts?.map((post) => (
          <li key={post._id}>
           <Card title={post.title} content={post.content} />
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more posts</p>}
    </div>
  );
};

export default InfiniteScrollPage;
