import { HashRouter } from 'react-router-dom';
import Router from './routers';
import SwitchDark from '@/components/SwitchDark';

const App = () => {
  return (
    <div className="flex justify-center flex-col">
      <HashRouter>
        <Router />
      </HashRouter>
      <SwitchDark />
    </div>
  );
};

export default App;
