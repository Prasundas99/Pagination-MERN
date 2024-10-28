import PropTypes from 'prop-types';
import './card.css';

const Card = ({ title = "", content = "" }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-content">{content}</p>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

export default Card;
