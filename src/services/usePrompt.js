/**
 * These hooks re-implement the now removed useBlocker and usePrompt hooks in 'react-router-dom'.
 * Thanks for the idea @piecyk https://github.com/remix-run/react-router/issues/8139#issuecomment-953816315
 * Source: https://github.com/remix-run/react-router/commit/256cad70d3fd4500b1abcfea66f3ee622fb90874#diff-b60f1a2d4276b2a605c05e19816634111de2e8a4186fe9dd7de8e344b65ed4d3L344-L381.
 */
import { useContext, useEffect, useCallback, forwardRef } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

import { Grow } from '@mui/material';
import { useDialog } from '../components/animate/dialog/DialogProvider';
import openDeleteDialog from '../components/animate/dialog/DeleteDialog';

const Transition = forwardRef(function Transition (props, ref) {
  return <Grow ref={ref} {...props} timeout={400} />;
});

/**
 * Blocks all navigation attempts. This is useful for preventing the page from
 * changing until some condition is met, like saving form data.
 *

 * @arg {string} blocker
 * @arg {boolean} when
 * @see https://reactrouter.com/api/useBlocker
 * @example
 */
export function useBlocker (blocker, when = true) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry () {
          // Automatically unblock the transition so it can play all the way
          // through before retrying it. TODO: Figure out how to re-enable
          // this block if the transition is cancelled for some reason.
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}

/**
 *
 * @arg {string} message Whom to greet.
 * @arg {boolean} when
 */
export function usePrompt (message, when = true) {
  const dialog = useDialog();
  const blocker = useCallback(
    async (tx) => {
      // eslint-disable-next-line no-alert
      const result = await openDeleteDialog({
        dialog,
        title: 'Leave site ?',
        content: 'You\'re sure to leave meeting ?',
        dialogProps: {
          maxWidth: 'sm',
          fullWidth: true,
          TransitionComponent: Transition,
        },
      });

      if (result) tx.retry();
    },
    [message],
  );

  useBlocker(blocker, when);
}
