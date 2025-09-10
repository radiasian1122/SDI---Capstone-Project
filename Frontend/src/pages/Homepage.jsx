import Navbar from "../components/Navbar";
import Dispatches from "../components/Dispatches";
import Cart from "../components/Cart";
import { useState } from "react";

// (dev only)
import DevRoleSwitcher from "../components/DevRoleSwitcher";

{
  import.meta.env.DEV && <DevRoleSwitcher />;
}

function Homepage() {
  const [dispatches, setDispatches] = useState();

  return (
    <div>
      <Navbar />
      {!dispatches && (
        <p>No vehicles currently dispatched. Add one to get started!</p>
      )}
      {dispatches && <Dispatches />}

      <Cart />
    </div>
  );
}

export default Homepage;
