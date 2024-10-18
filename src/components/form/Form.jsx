import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import BackdropLoading from '../../pages/backdrop_loading/BackdropLoading';

export default function Form (props) {
  const {
    showBackdropWhenLoading,
    children,
    promptWhenUnsavedChanges,
    formik,
    isRhf,
    rhfDirty,
    ...other
  } = props;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Set a timeout to simulate loading time
    return () => clearTimeout(loadingTimeout);
  }, []);

  const handleChildLoaded = () => {
    const loadedChildren = React.Children.map(children, (child) => {
      if (child.props.onLoad) {
        return child.props.onLoad();
      } else {
        return true;
      }
    });
    if (loadedChildren.every((child) => child)) {
      setIsLoading(false);
    }
  };

  return (
    <form autoComplete="off" noValidate {...other}>
      {isLoading && showBackdropWhenLoading
        ? (
        <BackdropLoading />
          )
        : (
            ''
          )}
      {showBackdropWhenLoading
        ? React.Children.map(children, (child) => {
          if (child) { return React.cloneElement(child, { onLoad: handleChildLoaded }); }
        })
        : children}
    </form>
  );
}

Form.propTypes = {
  showBackdropWhenLoading: PropTypes.bool,
  promptWhenUnsavedChanges: PropTypes.bool,
  tourGuideKey: PropTypes.string,
  formik: PropTypes.object,
  rhfDirty: PropTypes.bool,
  isRhf: PropTypes.bool,
};

Form.defaultProps = {
  showBackdropWhenLoading: false,
  promptWhenUnsavedChanges: false,
  tourGuideKey: '',
};
