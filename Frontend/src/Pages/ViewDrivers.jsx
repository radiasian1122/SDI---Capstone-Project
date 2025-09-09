import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";

// End of dependendecy component

export default function ViewDrivers() {
  const [operator, setOperator] = useState();

  //   useEffect(() => {
  //     fetch("")
  //       .then((res) => res.json())
  //       .then((json) => {
  //         setInventory(json);
  //       });
  //   }, []);
  return (
    <div>
      <Navbar />
    </div>
  );
}
