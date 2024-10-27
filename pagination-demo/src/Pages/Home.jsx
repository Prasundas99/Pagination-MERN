import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px', margin: 'auto' }}>
      <h1>Welcome to the Blog Application</h1>
      <p>Select an option below to proceed:</p>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}>
            <Link to="/add-post" style={{ fontSize: '18px', textDecoration: 'none' }}>
              Add New Post
            </Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/pagination" style={{ fontSize: '18px', textDecoration: 'none' }}>
              View Posts with Pagination
            </Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/infinite-scroll" style={{ fontSize: '18px', textDecoration: 'none' }}>
              View Posts with Infinite Scroll
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
