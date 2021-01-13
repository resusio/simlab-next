import { FC, Fragment, useContext } from 'react';
import _ from 'underscore';

import isNumeric from '../../utils/isNumeric';

import Table from 'react-bootstrap/Table';

import { fullTestResultType } from '@resusio/simlab';

import { SimlabContext } from '../../contexts/simlabContext';
import TestResultRow from './TestResultRow';

import styles from './testResultTable.module.scss';

export interface TestResultTableProps {
  results: fullTestResultType;
  setResults: (newResults: fullTestResultType) => void;
}

const TestResultTable: FC<TestResultTableProps> = ({ results, setResults }) => {
  const { simlab } = useContext(SimlabContext);

  return (
    <Table striped size="sm">
      {results.categories.map((category) => (
        <Fragment key={category.name}>
          <thead className="thead-dark">
            <tr>
              <th colSpan={6}>{category.name || 'Miscellaneous'}</th>
            </tr>
          </thead>
          <tbody>
            {category.testIds.map((testId) => (
              <TestResultRow
                key={testId}
                testResult={results.tests[testId]}
                updateValue={(newValue) => {
                  // TODO: when updating, need to convert out of current units to base units, so that
                  // derived units calculate correctly
                  const newResults = simlab.updateAndFetchSingleTest(testId, newValue);
                  const combinedTests = _.extend({}, results.tests, newResults.tests);

                  setResults({
                    categories: results.categories,
                    tests: combinedTests,
                  });
                }}
                toggleLocked={(isLocked) => simlab.setResultLockState(testId, isLocked)}
              />
            ))}
          </tbody>
        </Fragment>
      ))}
    </Table>
  );
};

export default TestResultTable;
