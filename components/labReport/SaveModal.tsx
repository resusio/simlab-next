import { FC, useEffect, useRef, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Tag from '../Tag';

import styles from './saveModal.module.scss';

export interface SaveSettingsType {
  reportName: string;
  tags: string[];
  isPublic: boolean;
}

interface SaveModalProps {
  onCancel: () => void;
  onSave: (newSaveSettings: SaveSettingsType) => void;
}

const SaveModal: FC<SaveModalProps> = ({ onCancel, onSave }) => {
  const reportNameElement = useRef<HTMLInputElement | null>(null);

  const [reportName, setReportName] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currTagText, setCurrTagText] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const [reportNameError, setReportNameError] = useState<string | false>(false);
  const [tagError, setTagError] = useState<string | false>(false);

  useEffect(() => {
    if (reportNameElement.current) {
      reportNameElement.current.focus();
    }
  }, []);

  return (
    <Modal show={true} onHide={onCancel} dialogClassName={styles.modal} backdrop="static">
      <Form
        onSubmit={(e) => {
          e.preventDefault();

          if (reportName === '') setReportNameError('A report name must be provided');
          else onSave({ reportName, tags, isPublic });
        }}
      >
        <Modal.Header>
          <Modal.Title>Save Lab Report</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-0">
          <Container fluid>
            <Form.Group controlId="reportName">
              <Form.Label>Report Name</Form.Label>
              <Form.Control
                type="text"
                name="reportName"
                ref={reportNameElement} // Used to correctly set first focus
                placeholder="Enter a name for this lab report"
                value={reportName}
                className={reportNameError ? styles.inputError : undefined}
                onChange={(e) => {
                  setReportName(e.target.value);
                  setReportNameError(false); // clear error
                }}
                required
              />
              <Form.Text className="text-danger">{reportNameError}</Form.Text>
            </Form.Group>
            <Form.Group controlId="reportTags">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                placeholder="Provide a tag and press Enter to add it to the list"
                value={currTagText}
                className={tagError ? styles.inputError : undefined}
                onChange={(e) => {
                  setCurrTagText(e.target.value);
                  setTagError(
                    tags.includes(e.target.value)
                      ? `Tag with name '${e.target.value}' already exists.`
                      : false
                  );
                }}
                onKeyUp={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' && currTagText !== '') {
                    if (!tags.includes(currTagText)) {
                      // ensure no duplicates
                      setTags((tags) => [...tags, currTagText]);
                      setCurrTagText(''); // clear the tag add box
                    } else setTagError(`Tag with name '${currTagText}' already exists.`);
                  }
                }}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') e.preventDefault(); // Do not auto-submit the form from this field
                }}
              />
              <div className="mt-2">
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    value={tag}
                    onRemoveClicked={(tag) => setTags(tags.filter((val) => val !== tag))}
                    showClose
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group controlId="reportIsPublic">
              <Form.Label>Accessibility</Form.Label>
              <Form.Check
                id={`check-is-public`}
                label={
                  <span className="text-muted">Allow this lab report to be viewed by anyone</span>
                }
                custom
                checked={isPublic}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setIsPublic((isPublic) => !isPublic)
                }
              />
            </Form.Group>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Report
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SaveModal;
