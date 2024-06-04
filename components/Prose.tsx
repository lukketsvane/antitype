// components/Prose.tsx
import { PropsWithChildren } from 'react';

const Prose = ({ children }: PropsWithChildren<{}>) => {
  return <div className="prose">{children}</div>;
};

export default Prose;
