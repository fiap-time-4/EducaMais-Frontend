'use client';

import styled from 'styled-components';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  background-color: #F9FAFB;
  min-height: calc(100vh - 200px);
`;

export { LayoutWrapper, MainContent };

