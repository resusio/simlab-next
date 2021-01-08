import { FC, useEffect, useState } from 'react';

import Form from 'react-bootstrap/Form';
import { Lock, LockFill, Calculator, Unlock } from 'react-bootstrap-icons';

import {
  testResultFlag,
  testResultWithMetadataType,
} from '@resusio/simlab/dist/types/labReportTypes';
import { labTestGenerateMethod, testResultType } from '@resusio/simlab';

import styles from './testResultRow.module.scss';

function isNumeric(str: any) {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN((str as unknown) as number) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

function TestValueToString(test: testResultWithMetadataType) {
  return test.valueType === 'number'
    ? (test.value as number).toFixed(test.display.precision)
    : test.value.toString();
}

const textFlagStyles = {
  [testResultFlag.NORMAL]: styles.normal,
  [testResultFlag.ABNORMAL]: styles.abnormal,
  [testResultFlag.CRITICAL_LOW]: styles.critLow,
  [testResultFlag.LOW]: styles.low,
  [testResultFlag.HIGH]: styles.high,
  [testResultFlag.CRITICAL_HIGH]: styles.critHigh,
};

const rowFlagStyles = {
  [testResultFlag.NORMAL]: styles.normalRow,
  [testResultFlag.ABNORMAL]: styles.abnormalRow,
  [testResultFlag.CRITICAL_LOW]: styles.critLowRow,
  [testResultFlag.LOW]: styles.lowRow,
  [testResultFlag.HIGH]: styles.highRow,
  [testResultFlag.CRITICAL_HIGH]: styles.critHighRow,
};

export interface TestResultRowProps {
  testResult: testResultWithMetadataType;
  updateValue: (newValue: testResultType) => void; // TODO: change this so that this component parses into a string or number
  toggleLocked: (isLocked: boolean) => void;
}
//TODO: Make a validate function combined with format for each test
const TestResultRow: FC<TestResultRowProps> = ({ testResult, updateValue, toggleLocked }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const [isLocked, setIsLocked] = useState(testResult.isLocked);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setValue(TestValueToString(testResult));
  }, [testResult.value]);

  const flagTextStyle = textFlagStyles[testResult.display.flag];
  const flagRowStyle = rowFlagStyles[testResult.display.flag];

  const validateInput = (value: string) => {
    if (testResult.valueType === 'number') return isNumeric(value);
    else return true;
  };

  const valueControl = isOpen ? (
    <Form.Control
      type="text"
      size="sm"
      value={value}
      plaintext
      autoFocus
      onChange={(e) => {
        setValue(e.target.value);
        setIsValid(validateInput(e.target.value));
      }}
      onKeyUp={(e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
          setValue(TestValueToString(testResult));
          (e.target as HTMLInputElement).blur();
        } else if (e.key === 'Enter') {
          if (isValid) {
            updateValue(value);
            (e.target as HTMLInputElement).blur();
          }
        }
      }}
      onBlur={() => setIsOpen(false)} // TODO: as it stands, if blur by clicking off, then updateValue is not called. if updateValue in blur, it updates when ypu press escape with the wrong value.
      className={`${styles.valueControl} ${!isValid ? styles.invalid : ''}`}
    />
  ) : (
    <Form.Control
      type="text"
      plaintext
      readOnly
      onFocus={() => setIsOpen(true)}
      value={value}
      className={styles.valueControl}
    />
  );

  return (
    <tr className={flagRowStyle}>
      <td>{testResult.nomenclature.short}</td>
      <td width={100}>{valueControl}</td>
      <td dangerouslySetInnerHTML={{ __html: testResult.display.unitDisplay }} />
      <td className={`${styles.flagCol} ${flagTextStyle}`}>{testResult.display.flag}</td>
      <td className={`${styles.calcCol} d-print-none`}>
        {testResult.generatedType === labTestGenerateMethod.DERIVED ? <Calculator /> : ''}
      </td>
      <td
        className={`${styles.lockCol} d-print-none`}
        onClick={() => {
          setIsLocked((currState) => !currState);
          toggleLocked(!isLocked);
        }}
      >
        {isLocked ? <LockFill className={styles.locked} /> : <Unlock className={styles.unlocked} />}
      </td>
    </tr>
  );
};

export default TestResultRow;
