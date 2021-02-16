import { FC, useMemo, useState } from 'react';

import useFuse from '../../../utils/hooks/useFuse';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export interface ReportSettingsProps {
  masterList: { id: string; nomenclature: { short: string; long: string } }[];
  selected: string[];
  onChange: (newTests: string[]) => void;
}

const ListSettings: FC<ReportSettingsProps> = ({ masterList, selected, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const sortedMasterList = useMemo(
    () => [...masterList].sort((a, b) => a.nomenclature.short.localeCompare(b.nomenclature.short)),
    [masterList]
  );
  const fuse = useFuse(sortedMasterList, ['id', 'nomenclature.long', 'nomenclature.short']);

  const results = fuse.search(searchTerm).filter((item) => item.score && item.score <= 0.3);
  const resultsWithDefault =
    results.length > 0 ? results : sortedMasterList.map((test, i) => ({ item: test, refIndex: i })); // Reformat to the fuse result format so it can be rendered by the same code.

  return (
    <Form>
      <Row>
        <Col sm={6}>
          <Form.Control
            type="text"
            value={searchTerm}
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          <div
            style={{
              height: '17vh',
              overflowY: 'scroll',
              border: '0px solid red',
            }}
            className="pl-2"
          >
            {resultsWithDefault.length > 0 ? (
              resultsWithDefault.map((result) => (
                <Form.Check
                  id={`check-${result.item.id}`}
                  key={result.item.id}
                  type="checkbox"
                  label={
                    resultsWithDefault.filter(
                      (testRes) => testRes.item.nomenclature.long === result.item.nomenclature.long
                    ).length > 1
                      ? `${result.item.nomenclature.long} [${result.item.id}]`
                      : result.item.nomenclature.long
                  }
                  custom
                  checked={selected.includes(result.item.id)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked)
                      // selected, add it to the list
                      onChange([...selected, result.item.id]);
                    // unselected, remove it from the list
                    else onChange(selected.filter((id) => id !== result.item.id));
                  }}
                />
              ))
            ) : (
              <h1>No tests</h1>
            )}
          </div>
        </Col>
        <Col sm={6}>
          <h6>Selected</h6>
          <div
            style={{
              minHeight: '17vh',
              maxHeight: '25vh',
              overflowY: 'scroll',
              border: '0px solid green',
            }}
          >
            <ul>
              {selected.sort().map((id) => (
                <li key={id}>
                  <em>
                    {sortedMasterList.find((item) => item.id === id)?.nomenclature.long}
                    <br />
                  </em>
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default ListSettings;
