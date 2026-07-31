
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import Home from './pages/Home';
import CreateTransaction from './pages/CreateTransaction';
import AcceptPayment from './pages/AcceptPayment';
import PaymentDetails from './pages/PaymentDetails';
import PaymentSuccess from './pages/PaymentSuccess';
import TransactionStatus from './pages/TransactionStatus';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateTransaction />} />
            <Route path="/accept" element={<AcceptPayment />} />
            <Route path="/payment/:txId" element={<PaymentDetails />} />
            <Route path="/payment-success/:txId" element={<PaymentSuccess />} />
            <Route path="/status/:txId" element={<TransactionStatus />} />
            <Route path="/status" element={<TransactionStatus />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
