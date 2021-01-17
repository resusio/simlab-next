import { FC, useState } from 'react';

import Badge from 'react-bootstrap/Badge';
import { XCircle, XCircleFill } from 'react-bootstrap-icons';

import styles from './tag.module.scss';

interface TagProps {
  onRemoveClicked?: (tag: string) => void;
  showClose?: boolean;
  value: string;
}

const Tag: FC<TagProps> = ({ onRemoveClicked, value, showClose = false }) => {
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <Badge pill variant="success" className={`${styles.badge} mr-1`}>
      <span
        className={`mr-${showClose ? '2' : '0'} ${
          showClose ? styles.valueWithClose : styles.valueNoClose
        }`}
      >
        {value}
      </span>
      {showClose ? (
        <span
          onMouseEnter={() => setMouseOver(true)}
          onMouseLeave={() => setMouseOver(false)}
          onClick={() => onRemoveClicked && onRemoveClicked(value)}
        >
          {mouseOver ? (
            <XCircleFill className={styles.closeIcon} />
          ) : (
            <XCircle className={styles.closeIcon} />
          )}
        </span>
      ) : null}
    </Badge>
  );
};

export default Tag;
