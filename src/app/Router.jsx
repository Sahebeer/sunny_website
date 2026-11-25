import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { LabPage } from '../features/lab';

export function AppRouter() {
  return (
    <HashRouter>
      <ErrorBoundary sectionName="Character Lab">
        <Routes>
          <Route path="/lab" element={<LabPage />} />
          <Route path="*" element={<LabPage />} />
        </Routes>
      </ErrorBoundary>
    </HashRouter>
  );
}

export default AppRouter;

