import './BackdropLoading.css'; // Assuming you put the CSS in this file

const BackdropLoading = ({ chidren }) => {
  return (
		<div className="backdrop">
			<div className="loader">
				{chidren}
			</div>
		</div>
  );
};

export default BackdropLoading;
