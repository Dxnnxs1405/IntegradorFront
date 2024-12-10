import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CanchasPage from "./pages/CanchasPage";
import AcademiesPage from "./pages/AcademiesPage";
import AuthPage from "./pages/AuthPage.jsx";
import { UserProvider } from "./context/UserContext";
import AdminPage from "./pages/AdminPage";
import ClientReservationsPage from './pages/ClientReservationsPage';

function App() {
    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={
                            <>
                                <Header />
                                <div className="body-content">
                                    <CanchasPage />
                                </div>
                                <Footer />
                            </>
                        } />
                        <Route path="/login" element={
                            <>
                                <AuthPage />
                            </>
                        } />
                        <Route path="/client-reservations" element={
                            <>
                                <Header />
                                <div className="body-content">
                                    <ClientReservationsPage />
                                </div>
                                <Footer />
                            </>
                        } />
                        <Route path="/academies" element={
                            <>
                                <Header />
                                <div className="body-content">
                                    <AcademiesPage />
                                </div>
                                <Footer />
                            </>
                        } />
                        <Route path="/admin" element={
                            <>
                                <AdminPage />
                            </>
                        } />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;