import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Iconify from '../iconify/iconify';

const ListBox = forwardRef(function ListBoxBase (props, ref) {
  const { children, hasMore, ...rest } = props;
  const innerRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(null);
  useImperativeHandle(ref, () => innerRef.current);

  useEffect(() => {
    if (innerRef.current) {
      const childHeight = innerRef.current.children[0]?.clientHeight;
      const maxOptions = Math.round(
        innerRef.current.clientHeight / childHeight,
      );
      const scrollDownHeight = hasMore ? 20 : 0; // height of the "scroll down" message
      setMaxHeight(maxOptions * childHeight - scrollDownHeight - 10); // subtract 10 pixels for margin
    }
  }, [children, hasMore]);

  return (
      <ul {...rest} ref={innerRef} role="list-box" style={{ maxHeight }}>
        {children}
        {(hasMore || rest.showScrollDown) && (
          <div
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              height: '20px',
            }}
          >
            <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
              <Iconify icon="akar-icons:arrow-down" />
            </span>
            <span
              style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                marginLeft: '10px',
                fontWeight: 'bold',
                color: '#555',
              }}
            >
              Keep scrolling for more options
            </span>
          </div>
        )}
      </ul>
  );
});

export default ListBox;
