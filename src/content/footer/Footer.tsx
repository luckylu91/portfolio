import "../styles.css";
import "./Footer.css";

export function Footer() {
  return (
    <footer id="footer">
  	<div className="container">
  		<div className="row">
  			<div className="col-md-3 widget">
  				<h3 className="widget-title">Contact</h3>
  				<div className="widget-body">
  					<p>
              +33618747568<br/>
  						<a href="mailto:#">zins.lucas@gmail.com</a><br/>
  						<br/>
              55 bis avenue René Cassin<br/>
              Lyon 69009, France
  					</p>
  				</div>
  			</div>

  			<div className="col-md-3 widget">
  				<h3 className="widget-title">Follow me</h3>
  				<div className="widget-body">
  					<p className="follow-me-icons">
  						<a href="https://www.github.com/luckylu91"><i className="fa fa-github fa-2"></i></a>
  						<a href="https://fr.linkedin.com/in/lucas-zins"><i className="fa fa-linkedin fa-2"></i></a>
  					</p>
  				</div>
  			</div>

  		</div>
  	</div>
    </footer>
  );
}
