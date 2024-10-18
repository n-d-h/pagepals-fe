import PropTypes from 'prop-types';

const TextTruncate = ({ text, maxWidth }) => {
  return (
		<div
			style={{
			  whiteSpace: 'nowrap',
			  overflow: 'hidden',
			  textOverflow: 'ellipsis',
			  maxWidth: maxWidth + 'px',
			}}
		>
			<span>{text}</span>
		</div>
  );
};

export default TextTruncate;

TextTruncate.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  maxWidth: PropTypes.number,
};

TextTruncate.defaultProps = {
  text: '',
  maxWidth: 0,
};
