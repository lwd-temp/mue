import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './scss/index.scss';
// the toast css is based on default so we need to import it
import 'react-toastify/dist/ReactToastify.css';

import '@fontsource/lexend-deca/latin-400.css';
import '@fontsource/roboto/cyrillic-400.css';

// language
import merge from '@material-ui/utils/deepmerge';
const languagecode = localStorage.getItem('language') || 'en_GB';
// we set things to window. so they're global and we avoid passing the translation strings as props to each component
window.languagecode = languagecode.replace('-', '_');
// these are merged so if a string is untranslated it doesn't break mue
window.language = merge(require('./translations/en_GB.json'), require(`./translations/${window.languagecode}.json`));
// set html language tag
if (window.languagecode !== 'en_GB' || window.languagecode !== 'en_US') {
  document.documentElement.lang = window.languagecode;
}

// window.constants
import * as Constants from './modules/constants';
window.constants = Constants;

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
