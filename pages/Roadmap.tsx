import {
  CheckCircleFill as Done,
  DashCircleFill as InProgress,
  CircleFill as NotStarted,
} from 'react-bootstrap-icons';

import PageHeader from '../components/PageHeader';

import styles from '../styles/roadmap.module.scss';

const RoadmapPage = () => {
  const DoneIcon = () => <Done className={styles.doneIcon} />;
  const InProgressIcon = () => <InProgress className={styles.inProgressIcon} />;
  const NotStartedIcon = () => <NotStarted className={styles.notStartedIcon} />;

  return (
    <>
      <PageHeader title="Feature Roadmap" />
      <ul className={styles.roadmapList}>
        <li>
          <DoneIcon /> Non-numeric lab results
        </li>
        <li>
          <DoneIcon /> Add capability for male/female, age/weight, etc.
        </li>
        <li>
          <DoneIcon /> Nicer unit fonts (e.g. proper superscripts)
        </li>
        <li>
          <DoneIcon /> Needs dependency or default for calculate values
        </li>
        <li>
          <DoneIcon /> Prevent some labs from having negative numbers
        </li>
        <li>
          <DoneIcon /> Navigation
        </li>
        <li>
          <DoneIcon /> Support order sets
        </li>
        <li>
          <DoneIcon /> Standard ordering for categories
        </li>
        <li>
          <DoneIcon /> Allow diseases to be selected that influences lab output
        </li>
        <li>
          <DoneIcon /> Separate lab generator into separate package
        </li>
        <li>
          <DoneIcon /> Select labs, patient settings, disease process, etc.
        </li>
        <li>
          <DoneIcon /> Allow re-generation of lab results at the click of a button
        </li>
        <li>
          <DoneIcon /> Allow locking of values that have been edited so that they don't get
          regenerated
        </li>
        <li>
          <DoneIcon /> Prevent calculated values from being updated directly, instead update as
          dependencies are changed
        </li>
        <li>
          <DoneIcon /> Save sets of labs to user account
        </li>
        <li>
          <DoneIcon /> Ability to type and filter saved lab reports
        </li>
        <li>
          <DoneIcon /> Ability to delete lab reports
        </li>
        <li>
          <DoneIcon /> Feedback/contact form
        </li>
        <li>
          <DoneIcon /> Add a help page
        </li>
        <li>
          <InProgressIcon /> ABG calculator (improve manner in which tests are modified by diseases)
        </li>
        <li>
          <NotStartedIcon /> Allow selection of different units for labs
        </li>
        <li>
          <NotStartedIcon /> Persist settings/labs requested across page refresh
        </li>
        <li>
          <NotStartedIcon /> Settings menu (e.g. long vs. short name, etc.)
        </li>
        <li>
          <NotStartedIcon /> Export PDF, DOCX, XLSX
        </li>
      </ul>
    </>
  );
};

export default RoadmapPage;
