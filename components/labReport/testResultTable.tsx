import { FC, Fragment, useContext } from 'react';
import _ from 'underscore';

import Table from 'react-bootstrap/Table';

import { fullTestResultType } from '@resusio/simlab';

import { SimlabContext } from '../../contexts/simlabContext';
import TestResultRow from './testResultRow';

import styles from './testResultTable.module.scss';

export interface TestResultTableProps {
  results: fullTestResultType;
  setResults: (newResults: fullTestResultType) => void;
}

//TODO: abstract this into a separate file.
function isNumeric(str: any) {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN((str as unknown) as number) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
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
                  const typedNewValue = isNumeric(newValue)
                    ? Number.parseFloat(newValue.toString())
                    : newValue;
                  // TODO: when updating, need to convert out of current units to base units, so that
                  // derived units calculate correctly
                  const newResults = simlab.updateAndFetchSingleTest(testId, typedNewValue);
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
