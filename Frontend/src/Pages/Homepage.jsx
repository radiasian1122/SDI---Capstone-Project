import Navbar from "../Components/Navbar";
import Dispatches from "../Components/Dispatches";
import Cart from "../Components/Cart";
import { useState } from "react";

// (dev only)
import DevRoleSwitcher from "../Components/DevRoleSwitcher";

{
  import.meta.env.DEV && <DevRoleSwitcher />;
}

function Homepage() {
  const [dispatches, setDispatches] = useState([]);

  return (
    <div>
      <Navbar />
      {dispatches.length > 0 ? (
        <Dispatches />
      ) : (
        <p>No vehicles currently dispatched. Add one to get started!</p>
      )}
      <Cart />
    </div>
  );
}

export default Homepage;
