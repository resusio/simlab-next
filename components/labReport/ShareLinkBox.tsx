import { FC, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { ClipboardCheck, ClipboardX, Clipboard } from 'react-bootstrap-icons';

import styles from './shareLinkBox.module.scss';

export interface ShareLinkBoxType {
  link: string;
}

const ShareLinkBox: FC<ShareLinkBoxType> = ({ link }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyError, setCopyError] = useState(false);

  return (
    <Container className={`${styles.shareLinkBox} p-2`}>
      <InputGroup>
        <Form.Control type="text" size="sm" value={link} />
        <InputGroup.Append>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              navigator.clipboard
                .writeText(link)
                .then(() => {
                  setCopySuccess(true);
                  setCopyError(false);
                })
                .catch(() => {
                  setCopySuccess(false);
                  setCopyError(true);
                });
            }}
          >
            {copySuccess ? (
              <ClipboardCheck className={styles.icon} />
            ) : copyError ? (
              <ClipboardX className={styles.icon} />
            ) : (
              <Clipboard className={styles.icon} />
            )}
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Container>
  );
};

export default ShareLinkBox;
