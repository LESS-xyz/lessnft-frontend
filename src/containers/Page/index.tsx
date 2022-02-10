import { Footer } from 'containers';
import { FC, ReactElement } from 'react';

interface IProps {
  component: ReactElement<any, any>;
  needFooter?: boolean;
}

const Page: FC<IProps> = ({ component, needFooter = true }) => {
  return (
    <>
      {component}
      {needFooter && <Footer />}
    </>
  );
};

export default Page;
