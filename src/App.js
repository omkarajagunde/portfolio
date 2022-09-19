import Header from "./Components/Header";
import Projects from "./Components/Projects";
import PersonalProjects from "./Components/PersonalProjects";

function App() {
	return (
		<>
			<div className="nav">
				<div className="nav__item">
					<a href="tel:+91 9028196004">+91 9028196004</a>
				</div>
				<div className="nav__item">
					<a href="mailto:ajagundeomkar@gmail.com">ajagundeomkar@gmail.com</a>
				</div>
			</div>
			<Header />
			<Projects />
			<PersonalProjects />
		</>
	);
}

export default App;
