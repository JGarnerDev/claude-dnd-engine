// Entry for session.html — the session runner. Data is the next planned session
// (virtual:session-data, backed by scripts/session-cards.py).

import 'jeff-ui/tokens.css';
import '../theme.css';
import { renderRunner } from './runner.js';
import data from 'virtual:session-data';

const root = document.getElementById('app');
if (root) renderRunner(root, data);
