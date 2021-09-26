import React from 'react';

import { BrowserRouter } from "react-router-dom";
import MainRoutes  from './routes.js'


function App() {
  return (
    
      <BrowserRouter>
        <MainRoutes/>
      </BrowserRouter>
    
  );
}

export default App;

/*

const User = () => {
  const history = useHistory();
  const params = useParams();
  console.log(params);

  const handleBack = () => {
    history.goBack();
  };

  const handleNavigation = () => {
    history.push("/user/5");
  };

  return (
    <div>
      <div>This is the user page</div>
      <div>current user Id - {params.id}</div>
      <div>
        <button onClick={handleBack}>Go Back</button>
      </div>
      <div>
        <button onClick={handleNavigation}>Go To Different User</button>
      </div>
    </div>
  );
};




<BrowserRouter>
        <nav>
          <div>
            <Link to="/">Home</Link>
          </div>
          <div>
            <Link to="/user/:id">User</Link>
          </div>
        </nav>
        <Switch>
          <Route path="/user">
            <User />
          </Route>
          <Route path="/" >
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
*/