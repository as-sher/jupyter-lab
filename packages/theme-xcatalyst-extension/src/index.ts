// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IThemeManager } from '@jupyterlab/apputils';

/**
 * A plugin for the Jupyter XCatalyst Theme.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab/theme-xcatalyst-extension:plugin',
  requires: [IThemeManager],
  activate: (app: JupyterFrontEnd, manager: IThemeManager) => {
    const style = '@jupyterlab/theme-xcatalyst-extension/index.css';

    manager.register({
      name: 'JupyterLab XCatalyst',
      isLight: true,
      themeScrollbars: false,
      load: () => manager.loadCSS(style),
      unload: () => Promise.resolve(undefined)
    });
  },
  autoStart: true
};

export default plugin;
