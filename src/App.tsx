import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HotelList from './pages/HotelList';
import HotelPage from './pages/HotelPage';
import useLoadKakao from './hook/useLoadKakao';
import My from './pages/My';
import Signin from './pages/Signin';
import AuthGuard from './components/auth/AuthGuard';
import Navbar from './components/shared/Navbar';
import Like from './pages/Like';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  useLoadKakao();
  return (
    <BrowserRouter>
      <AuthGuard>
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
        </Routes>
      </AuthGuard>
    </BrowserRouter>
  );
}

export default App;
