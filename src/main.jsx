import './assets/styles.css';
import { lazy, Suspense } from 'react';
import { createSkateboardApp } from '@stevederico/skateboard-ui/App';
import { Spinner } from '@stevederico/skateboard-ui/shadcn/ui/spinner';
import Layout from '@stevederico/skateboard-ui/Layout';
import CommandMenu from './components/CommandMenu.jsx';
import constants from './constants.json';

import DirectoryView from './components/DirectoryView.jsx';
const MapView = lazy(() => import('./components/MapView.jsx'));

function AppLayout() {
  return (
    <>
      <CommandMenu />
      <Layout />
    </>
  );
}

const appRoutes = [
  { path: 'home', element: <DirectoryView /> },
  { path: 'map', element: <Suspense fallback={<div className="flex flex-1 items-center justify-center"><Spinner /></div>}><MapView /></Suspense> },
];

createSkateboardApp({
  constants,
  appRoutes,
  defaultRoute: 'home',
  overrides: { layout: AppLayout }
});

setTimeout(() => import('./components/MapView.jsx'), 2000);
