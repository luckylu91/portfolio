import "./Main.css";
import { Citation } from "./parts/Citation";
import { Profil } from "./parts/Profil";
import { APropos } from "./parts/APropos";
import { JeuxVideo } from "./parts/JeuxVideo";
import { Experience } from "./parts/Experience";
import { Projets } from "./parts/Projets";

export function Main() {
  return (
    <main id="main">
      <div className="container">
        <Citation/>
        <Profil/>
        <APropos/>
        <JeuxVideo/>
        <Experience/>
      </div>
      <Projets/>
      {/* <SomethingToTellInABox/> */}
    </main>
  );
}
