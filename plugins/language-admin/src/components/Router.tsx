import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AdminPage } from './AdminPage';
import { AddLanguagePage } from './AddLanguagePage';

export const Router = () => (
  <Routes>
    <Route path="/" element={AdminPage()} />
    <Route path="/add" element={AddLanguagePage()} />
  </Routes>
);
