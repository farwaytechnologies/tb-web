import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import PagesRout from './Routes/PagesRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <PagesRout/>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
