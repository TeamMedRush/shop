import { render } from 'preact';
import { AuthProvider } from '@contexts/auth-context';
import { CartProvider } from '@contexts/cart-context';
import { HomePage } from '@routes/home';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <HomePage />
      </CartProvider>
    </AuthProvider>
  );
}

const appDiv = document.getElementById('app')!;
render(<App />, appDiv);
appDiv.focus();

