import { render, screen } from '@testing-library/react';
import App from './App';

// Smoke test : verifie que l'application se monte sans planter et que la
// page d'accueil affiche bien le nom de la marque. Remplace l'ancien test
// par defaut de create-react-app ("learn react") qui ne correspondait a
// aucun contenu reel de MoneyGreen et echouait systematiquement.
test('renders the home page without crashing', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/MoneyGreen/i);
  expect(brandElements.length).toBeGreaterThan(0);
});
