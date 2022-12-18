import "../styles.css";
import "./Header.css";

export function Header() {
  return (
    <header id="header">
    <div id="head" className="parallax" parallax-speed="2">
      <h1 id="logo" className="text-center">
        <img className="img-circle" src="images/lucas.jpg" alt=""/>
        <span className="title">Lucas Zins</span>
        <span className="tagline">Developpeur<br/>
          <a href="">zins.lucas@gmail.com</a></span>
      </h1>
      <img id="head-background-image" src="images/header_back.jpg"/>
    </div>

    <nav className="navbar navbar-default navbar-sticky">
      <div className="container-fluid">

        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span> <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>

        <div className="navbar-collapse collapse">

          <ul className="nav navbar-nav">
            <li className="active"><a href="#">Top</a></li>
            <li><a href="#profile">Profil</a></li>
            <li><a href="#concerning">Plus à mon propos</a></li>
            <li><a href="#video-games">Jeux-Vidéo</a></li>
            <li><a href="#experience">Expérience</a></li>
            <li><a href="#projects">Projets</a></li>
          </ul>

        </div>
      </div>
    </nav>
  </header>
  );
}


