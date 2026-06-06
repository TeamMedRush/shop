import { render } from 'preact';

import { DataProvider } from '@data/index';
import { HomePage } from '@routes/home';

function App() {
  return (
    <DataProvider>
      <HomePage />
    </DataProvider>
  );
}

const appDiv = document.getElementById('app')!;
render(<App />, appDiv);
appDiv.focus();

