import {
  CheckCircleFill as Done,
  DashCircle as InProgress,
  Circle as NotStarted,
} from 'react-bootstrap-icons';

import styles from '../styles/roadmap.module.scss';

const RoadmapPage = () => {
  return (
    <>
      <h3>Feature Roadmap</h3>
      <ul className={styles.roadmapList}>
        <li>
          <Done /> Non-numeric lab results
        </li>
        <li>
          <Done /> Add capability for male/female, age/weight, etc.
        </li>
        <li>
          <Done /> Nicer unit fonts (e.g. proper superscripts)
        </li>
        <li>
          <Done /> Needs dependency or default for calculate values
        </li>
        <li>
          <Done /> Prevent some labs from having negative numbers
        </li>
        <li>
          <Done /> Navigation
        </li>
        <li>
          <Done /> Support order sets
        </li>
        <li>
          <Done /> Standard ordering for categories
        </li>
        <li>
          <Done /> Allow diseases to be selected that influences lab output
        </li>
        <li>
          <Done /> Separate lab generator into separate package
        </li>
        <li>
          <Done /> Select labs, patient settings, disease process, etc.
        </li>
        <li>
          <Done /> Allow re-generation of lab results at the click of a button
        </li>
        <li>
          <Done /> Allow locking of values that have been edited so that they don't get regenerated
        </li>
        <li>
          <Done /> Prevent calculated values from being updated directly, instead update as
          dependencies are changed
        </li>
        <li>
          <InProgress /> Save sets of labs to user account
        </li>
        <li>
          <InProgress /> ABG calculator (improve manner in which tests are modified by diseases)
        </li>
        <li>
          <NotStarted /> Persist settings/labs requested across page refresh
        </li>
        <li>
          <NotStarted /> Add a help page
        </li>
        <li>
          <NotStarted /> Settings menu (e.g. long vs. short name, etc.)
        </li>
        <li>
          <NotStarted /> Export PDF, DOCX, XLSX
        </li>
        <li>
          <NotStarted /> Feedback/contact form
        </li>
      </ul>
    </>
  );
};

export default RoadmapPage;
