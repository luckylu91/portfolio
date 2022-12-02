import "../styles.css";
import "./Footer.css";

export function UnderFooter() {
  return (
    <footer id="underfooter">
  	<div className="container">
  		<div className="row">

  			<div className="col-md-6 widget">
  				<div className="widget-body">
  					<p>55 bis avenue René Cassin<br/>Lyon 69009</p>
  				</div>
  			</div>

  			<div className="col-md-6 widget">
  				<div className="widget-body">
  					<p className="text-right">
  						Copyright &copy; 2022, Lucas Zins<br/>
  						Design: <a href="http://www.gettemplate.com" rel="designer">Initio by GetTemplate</a> </p>
  				</div>
  			</div>

  		</div>
  	</div>
    </footer>
  );
}
