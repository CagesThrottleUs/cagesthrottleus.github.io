import { ProgressCircle } from '@react-spectrum/s2';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router';

import { CommonStyler } from './common/component';

export default function AppRoutes() {
  return (
    <CommonStyler>
      <Suspense
        fallback={<ProgressCircle aria-label="Loading" isIndeterminate />}
      >
        <Routes>
          <Route
            path="/"
            element={<ProgressCircle aria-label="Loading" isIndeterminate />}
          />
        </Routes>
      </Suspense>
    </CommonStyler>
  );
}
