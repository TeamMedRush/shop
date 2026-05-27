import { render } from 'preact';
import { HomePage } from '@routes/home';

function App() {
  return <HomePage />;
}

const appDiv = document.getElementById('app')!;
render(<App />, appDiv);
appDiv.focus();

