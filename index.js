/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import 'node-libs-react-native/globals';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import "text-encoding-polyfill";
import '@azure/core-asynciterator-polyfill'

AppRegistry.registerComponent(appName, () => App);
