//src/App.tsx
import React from 'react';
import AppRoutes from './router/routes.tsx';
import Navbar from './components/navbar/index.tsx'; 

function App() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <AppRoutes />
      </div>
    </>
  );
}


export default App;
