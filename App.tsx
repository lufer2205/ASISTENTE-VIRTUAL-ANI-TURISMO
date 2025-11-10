import React from 'react';
import Chat from './components/Chat';
import { ANI_AVATAR_BASE64 } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 font-sans">
      <header className="w-full max-w-4xl mx-auto flex items-center space-x-4 p-4">
        <img src={ANI_AVATAR_BASE64} alt="ANI Avatar" className="w-16 h-16 rounded-full border-4 border-sky-400 shadow-lg" />
        <div>
          <h1 className="text-3xl font-bold text-sky-800">ANI</h1>
          <p className="text-md text-sky-600">Tu Asistente de Turismo en Nocaima</p>
        </div>
      </header>
      <main className="w-full flex-grow">
        <Chat />
      </main>
    </div>
  );
};

export default App;