import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'One-Line code Configuration',
    Svg: require('@site/static/img/one.svg').default,
    description: (
      <>
        Quickly integrate LitLyx using just a single line of code, and start gathering critical insights instantly.
      </>
    ),
  },
  {
    title: 'Easy Documentation',
    Svg: require('@site/static/img/doc.svg').default,
    description: (
      <>
       Access simple, easy-to-follow documentation  helping you get started and make the most out of the tool, quickly.
      </>
    ),
  },
  {
    title: 'Plug Anywhere',
    Svg: require('@site/static/img/plug.svg').default,
    description: (
      <>
       More than 15+ JS/TS Framework supported. The vanilla JS Script can plug in any solution even WordPress or PHP.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
