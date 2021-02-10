import { FC, useState } from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

import matter from 'gray-matter';
import gfm from 'remark-gfm';
import fs from 'fs';
import glob from 'glob';

import ReactMarkdown from 'react-markdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

import PageHeader from '../components/PageHeader';

import styles from '../styles/help.module.scss';

type HelpPage = {
  title: string;
  author: string;
  order: number;
  content: string;
};

const HelpPage = ({ helpPages }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [currentTab, setCurrentTab] = useState(0);

  const content = helpPages;

  const CustomImage: FC = (props) => <img className={styles.helpdocImage} {...props} />;

  return (
    <>
      <PageHeader title="SimLab Help" />
      <Row className="mt-4">
        <Col xs={12} md={4} xl={2} className={`${styles.topicMenu} mb-4`}>
          <ListGroup variant="flush">
            {content.map((section, i) => (
              <ListGroup.Item
                key={i}
                variant="primary"
                action
                active={i === currentTab}
                onClick={() => setCurrentTab(i)}
              >
                {section.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col xs={12} md={8} xl={10}>
          <ReactMarkdown
            plugins={[gfm]}
            renderers={{ image: (props) => <CustomImage {...props} /> }}
          >
            {content[currentTab].content}
          </ReactMarkdown>
        </Col>
      </Row>
    </>
  );
};

export const getStaticProps = async () => {
  const paths = glob.sync(`${process.cwd()}/content/help/*.md`);

  const helpPages: HelpPage[] = paths
    .map((path) => {
      const page = matter(fs.readFileSync(path, 'utf8'));

      return {
        title: (page.data.title as string) ?? 'Untitled',
        author: (page.data.author as string) ?? '',
        order: (page.data.order as number) ?? Number.MAX_SAFE_INTEGER,
        content: page.content,
      };
    })
    .sort((a, b) => a.order - b.order);

  return {
    props: {
      helpPages: helpPages,
    },
  };
};

export default HelpPage;
