// (dev only)
import DevRoleSwitcher from "../components/DevRoleSwitcher";

{
  import.meta.env.DEV && <DevRoleSwitcher />;
}

export default function DispatchForm() {
  return (
    <div>
      <Navbar />
      <button>Add Vehicles</button>
      <button>Submit</button>
    </div>
  );
}
