import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthGuard from './components/auth/AuthGuard';
import Navbar from './components/shared/Navbar';
import PrivateRoute from './components/auth/PrivateRoute';
import ScrollToTop from './components/shared/ScrollToTop';
import { Suspense, lazy } from 'react';
import useLoadKakao from './hook/useLoadKakao';
import { HelmetProvider } from 'react-helmet-async';

const HotelList = lazy(() => import('./pages/HotelList'));
const HotelPage = lazy(() => import('./pages/HotelPage'));
const My = lazy(() => import('./pages/My'));
const Signin = lazy(() => import('./pages/Signin'));
const Like = lazy(() => import('./pages/Like'));
const Schedule = lazy(() => import('./pages/Schedule'));
const ReservationPage = lazy(() => import('./pages/Reservation'));
const ReservationDone = lazy(() => import('./pages/ReservationDone'));
const ReservationList = lazy(() => import('./pages/ReservationList'));

function App() {
  useLoadKakao();
  return (
    <Suspense fallback={<></>}>
      <HelmetProvider>
        <BrowserRouter>
          <AuthGuard>
            <ScrollToTop />
            <Navbar />
            <Routes>
              <Route path="/" Component={HotelList} />
              <Route path="/hotel/:id" Component={HotelPage} />
              <Route path="/signin" Component={Signin} />
              <Route
                path="/my"
                element={
                  <PrivateRoute>
                    <My />
                  </PrivateRoute>
                }
              />
              <Route
                path="/like"
                element={
                  <PrivateRoute>
                    <Like />
                  </PrivateRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <PrivateRoute>
                    <Schedule />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reservation"
                element={
                  <PrivateRoute>
                    <ReservationPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reservation/done"
                element={
                  <PrivateRoute>
                    <ReservationDone />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reservation/list"
                element={
                  <PrivateRoute>
                    <ReservationList />
                  </PrivateRoute>
                }
              />
            </Routes>
          </AuthGuard>
        </BrowserRouter>
      </HelmetProvider>
    </Suspense>
  );
}

export default App;
