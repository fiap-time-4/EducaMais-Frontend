import * as React from "react"
import styled from 'styled-components';

interface LabelProps {
  children?: React.ReactNode;
  htmlFor: string;
}

const LabelContainer = styled.label`
  color: ${props => props.theme.colors.text.muted};
  font-size: ${props => props.theme.typography.body.medium.fontSize};
  font-weight: ${props => props.theme.typography.headings.h3.fontWeight};
  font-family: ${props => props.theme.typography.fontFamily};
  margin-bottom: 0.5rem;
`;

const Label: React.FC<LabelProps> = ({ 
  children,
  htmlFor,
}) => {
  return (
    <LabelContainer
      htmlFor={htmlFor}
      className="text-base font-medium"
    >
      {children}
    </LabelContainer>
  );
};

export default Label;
