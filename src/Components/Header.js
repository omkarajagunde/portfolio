import React from "react";

// Icons !!
import Tile1 from "../res/9.png";
import Tile2 from "../res/8.png";
import Tile3 from "../res/7.png";
import Tile4 from "../res/6.png";
import Tile5 from "../res/5.png";
import Tile6 from "../res/4.png";
import Tile7 from "../res/3.png";
import Tile8 from "../res/2.png";
import Tile9 from "../res/1.png";

class Header extends React.Component {
	state = {
		scrollY: 1,
	};

	componentDidMount() {
		window.addEventListener("scroll", (e) => {
			if (window.pageYOffset > 100) this.setState({ scrollY: window.innerWidth < 768 ? 50 : 100 });
			else this.setState({ scrollY: window.pageYOffset });
		});
	}

	render() {
		return (
			<div className="header">
				<div className="header__left">
					<div className="header__title">
						Hi, I am <span style={{ color: "#38ACFF", fontSize: "1.2em" }}>Omkar </span>, <br /> Yet another software developer
					</div>
					<div className="header__links">
						<div>
							<a href="https://www.linkedin.com/in/omkarajagunde/">Linkedin</a>
						</div>
						<div>
							<a href="https://github.com/omkarajagunde">Github</a>
						</div>
						<div>
							<a href="/OmkarAjagundeUpdatedResume.pdf">Resume</a>
						</div>
					</div>
				</div>
				<div className="header__right">
					<div className="header__myPic">
						<div>
							<img style={{ transform: `translate(-${this.state.scrollY * 0.5}px,-${this.state.scrollY * 0.5}px)` }} src={Tile1} alt="" />
						</div>
						<div>
							<img style={{ transform: `translate(0px,-${this.state.scrollY * 0.5}px)` }} src={Tile2} alt="" />
						</div>
						<div>
							<img style={{ transform: `translate(${this.state.scrollY * 0.5}px,-${this.state.scrollY * 0.5}px)` }} src={Tile3} alt="" />
						</div>
						<div>
							<img style={{ transform: `translate(-${this.state.scrollY * 0.5}px,-0px)` }} src={Tile4} alt="" />
						</div>
						<div>
							<img style={{ transform: `translate(-0px,-0px)` }} src={Tile5} alt="" />
						</div>
						<div>
							<img style={{ transform: `translate(${this.state.scrollY * 0.5}px,-0px)` }} src={Tile6} alt="" />
						</div>
						<div>
							<img style={{ transform: `translate(-${this.state.scrollY * 0.5}px,${this.state.scrollY * 0.5}px)` }} src={Tile7} alt="" />
						</div>
						<div>
							<img style={{ transform: `translate(0px,${this.state.scrollY * 0.5}px)` }} src={Tile8} alt="" />
						</div>
						<div>
							<img style={{ transform: `translate(${this.state.scrollY * 0.5}px,${this.state.scrollY * 0.5}px)` }} src={Tile9} alt="" />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Header;
