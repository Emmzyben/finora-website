import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import ServicesPage from './pages/ServicesPage';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import TransactionsPage from './pages/dashboard/TransactionsPage';
import CardsPage from './pages/dashboard/CardsPage';
import ApplyCardPage from './pages/dashboard/ApplyCardPage';
import LocalTransferPage from './pages/dashboard/LocalTransferPage';
import InternationalWirePage from './pages/dashboard/InternationalWirePage';
import WireTransferPage from './pages/dashboard/WireTransferPage';
import CryptoTransferPage from './pages/dashboard/CryptoTransferPage';
import PayPalTransferPage from './pages/dashboard/PayPalTransferPage';
import WiseTransferPage from './pages/dashboard/WiseTransferPage';
import CashAppTransferPage from './pages/dashboard/CashAppTransferPage';
import SkrillTransferPage from './pages/dashboard/SkrillTransferPage';
import VenmoTransferPage from './pages/dashboard/VenmoTransferPage';
import ZelleTransferPage from './pages/dashboard/ZelleTransferPage';
import RevolutTransferPage from './pages/dashboard/RevolutTransferPage';
import AlipayTransferPage from './pages/dashboard/AlipayTransferPage';
import WeChatPayTransferPage from './pages/dashboard/WeChatPayTransferPage';
import DepositPage from './pages/dashboard/DepositPage';
import MakeDepositPage from './pages/dashboard/MakeDepositPage';
import LoanRequestPage from './pages/dashboard/LoanRequestPage';
import LoanApplyPage from './pages/dashboard/LoanApplyPage';
import IRSRefundPage from './pages/dashboard/IRSRefundPage';
import LoanHistoryPage from './pages/dashboard/LoanHistoryPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import KYCPage from './pages/dashboard/KYCPage';
import SupportPage from './pages/dashboard/SupportPage';
import InvestmentsPage from './pages/dashboard/InvestmentsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/sign-in" element={<SignInPage />} />
                    <Route path="/sign-up" element={<SignUpPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="*" element={<NotFound />} />
                </Route>

                {/* Dashboard Layout */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route index element={<DashboardPage />} />
                    <Route path="transactions" element={<TransactionsPage />} />
                    <Route path="cards" element={<CardsPage />} />
                    <Route path="cards/apply" element={<ApplyCardPage />} />
                    <Route path="localtransfer" element={<LocalTransferPage />} />
                    <Route path="internationaltransfer" element={<InternationalWirePage />} />
                    <Route path="internationaltransfer/wire" element={<WireTransferPage />} />
                    <Route path="internationaltransfer/crypto" element={<CryptoTransferPage />} />
                    <Route path="internationaltransfer/paypal" element={<PayPalTransferPage />} />
                    <Route path="internationaltransfer/wise" element={<WiseTransferPage />} />
                    <Route path="internationaltransfer/cashapp" element={<CashAppTransferPage />} />
                    <Route path="internationaltransfer/skrill" element={<SkrillTransferPage />} />
                    <Route path="internationaltransfer/venmo" element={<VenmoTransferPage />} />
                    <Route path="internationaltransfer/zelle" element={<ZelleTransferPage />} />
                    <Route path="internationaltransfer/revolut" element={<RevolutTransferPage />} />
                    <Route path="internationaltransfer/alipay" element={<AlipayTransferPage />} />
                    <Route path="internationaltransfer/wechatpay" element={<WeChatPayTransferPage />} />
                    <Route path="deposits" element={<DepositPage />} />
                    <Route path="deposits/make" element={<MakeDepositPage />} />
                    <Route path="loan" element={<LoanRequestPage />} />
                    <Route path="loan/apply" element={<LoanApplyPage />} />
                    <Route path="irs-refund" element={<IRSRefundPage />} />
                    <Route path="investments" element={<InvestmentsPage />} />
                    <Route path="viewloan" element={<LoanHistoryPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="kyc" element={<KYCPage />} />
                    <Route path="support" element={<SupportPage />} />
                </Route>

                <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
};

export default App;

