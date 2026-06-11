import './assets/styles.css';
import { createSkateboardApp } from '@stevederico/skateboard-ui/App';
import type { AppRoute } from '@stevederico/skateboard-ui/App';
import Layout from '@stevederico/skateboard-ui/Layout';
import CommandMenu from './components/CommandMenu';
import constants from './constants.json';

import DirectoryView from './components/DirectoryView';

function AppLayout() {
  return (
    <>
      <CommandMenu />
      <Layout />
    </>
  );
}

const appRoutes: AppRoute[] = [
  { path: 'home', element: <DirectoryView /> },
];

createSkateboardApp({
  constants,
  appRoutes,
  defaultRoute: 'home',
  overrides: { layout: AppLayout }
});
