import "../styles.css";
import "./Header.css";

export function Header() {
  return (
    <header id="header">
    <div id="head" className="parallax" parallax-speed="2">
      <h1 id="logo" className="text-center">
        <img className="img-circle" src="logo512.png" alt=""/>
        <span className="title">Lucas Zins</span>
        <span className="tagline">Developpeur<br/>
          <a href="">zins.lucas@gmail.com</a></span>
      </h1>
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
            <li className="active"><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li className="dropdown">
              <a
                href="#"
                className="dropdown-toggle"
                data-toggle="dropdown"
              >
                More Pages <b className="caret"></b>
              </a>
              <ul className="dropdown-menu">
                <li><a href="sidebar-left.html">Left Sidebar</a></li>
                <li><a href="sidebar-right.html">Right Sidebar</a></li>
                <li><a href="single.html">Blog Post</a></li>
              </ul>
            </li>
            <li><a href="blog.html">Blog</a></li>
          </ul>

        </div>
      </div>
    </nav>
  </header>
  );
}


