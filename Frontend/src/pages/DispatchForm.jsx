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
      <BackgroundMedia
            mp4Src="/media/slide2CCbg.mp4"
            // gifSrc="/media/login-bg.gif"
            // posterSrc="/media/login-poster.jpg"
            overlay
          >

          </BackgroundMedia>

    </div>
  );
}
