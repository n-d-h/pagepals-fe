import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from '../components/hooks/use-router';
import { paths } from '../components/router/paths';
import { selectUser, selectUserAuthenticated } from '../redux/slices/authSlice';

// ----------------------------------------------------------------------

const loginPaths = {
  jwt: paths.auth.login,
};

// ----------------------------------------------------------------------

export default function AuthGuard ({ children }, props) {
  return <Container {...props} > {children}</Container>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};

// ----------------------------------------------------------------------

function Container ({ children }) {
  const router = useRouter();

  const [checked, setChecked] = useState(false);

  const isAuthenticated = useSelector(selectUserAuthenticated);

  const userProfile = useSelector(selectUser);

  const isStaffOrAdmin = userProfile?.role?.name === 'STAFF' || userProfile?.role?.name === 'ADMIN';

  const check = useCallback(() => {
    if (!isAuthenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = loginPaths;

      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [router, isAuthenticated]);

  const checkStaffOrAdmin = useCallback(() => {
    if (isStaffOrAdmin) {
      if (window.location.pathname.includes('/meeting-zoom')) {
        setChecked(true);
      }

      if (window.location.pathname.includes('/main') || window.location.pathname.includes('/auth') || window.location.pathname.includes('/landing')) {
        router.replace(paths.dashboard.root);
      }
    } else {
      if (window.location.pathname.includes('/dashboard') || window.location.pathname.includes('/auth') || window.location.pathname.includes('/landing')) {
        router.replace(paths.main.root);
      }
    }
  }
  , [router, isStaffOrAdmin, window.location]);

  useEffect(() => {
    check();
    checkStaffOrAdmin();
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}

Container.propTypes = {
  children: PropTypes.node,
  isStaffOrAdmin: PropTypes.bool,
};
