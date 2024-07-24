import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import LayoutWrapper from './View/Layout/LayoutWrapper'
import { guestRoutes, userRoutes } from './routes/mainRoutes'

function App() {
  const routes = sessionStorage.getItem("userconnected") ? userRoutes : guestRoutes;
  // Render routes based on token presence
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mainContent = routes.map((route: any) =>
    route.component ? (
      <>
        <Route
          key={route.name}
          path={route.path}
          element={<route.component />}
        />
      </>
    ) : (
      route.redirectRoute && (
        <>
          <Route path="*" key={route.name} element={<Navigate to={route.path} />} />
        </>
      )
    ),
  );
  return (
    <Router>
      <Routes>
        <Route
          element={
            <LayoutWrapper
            />
          }
        >
          {mainContent}
        </Route>
      </Routes>
    </Router>
  )
}

export default App