// Entry for session-legacy.html — the old DOM session runner, kept until one real
// session has run on the React runner (react-migration PLAN, D3). Data is the next planned session
// (virtual:session-data, backed by scripts/session-cards.py).

import 'jeff-ui/tokens.css';
import '../theme.css';
import { renderRunner } from './legacy/runner.js';
import data from 'virtual:session-data';

const root = document.getElementById('app');
if (root) renderRunner(root, data);
