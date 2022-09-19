import React from "react";

class PersonalProjects extends React.Component {
	componentDidMount() {
		"use strict";

		function qs(selector, all = false) {
			return all ? document.querySelectorAll(selector) : document.querySelector(selector);
		}

		const sections = qs(".section", true);
		const timeline = qs(".timeline");
		const line = qs(".line");
		line.style.bottom = `calc(100% - 20px)`;
		let prevScrollY = window.scrollY;
		let up, down;
		let full = false;
		let set = 0;
		const targetY = window.innerHeight * 0.8;

		function scrollHandler(e) {
			const { scrollY } = window;
			up = scrollY < prevScrollY;
			down = !up;
			const timelineRect = timeline.getBoundingClientRect();
			const lineRect = line.getBoundingClientRect(); // const lineHeight = lineRect.bottom - lineRect.top;

			const dist = targetY - timelineRect.top;

			if (down && !full) {
				set = Math.max(set, dist);
				line.style.bottom = `calc(100% - ${set}px)`;
			}

			if (dist > timeline.offsetHeight + 50 && !full) {
				full = true;
				line.style.bottom = `-50px`;
			}

			sections.forEach((item) => {
				// console.log(item);
				const rect = item.getBoundingClientRect(); //     console.log(rect);

				if (rect.top + item.offsetHeight / 5 < targetY) {
					item.classList.add("show-me");
				}
			}); // console.log(up, down);

			prevScrollY = window.scrollY;
		}

		scrollHandler();
		line.style.display = "block";
		window.addEventListener("scroll", scrollHandler);
	}

	render() {
		return (
			<div className="acedemicProjectWrapper">
				<div className="projects__title">Academic projects</div>
				<div className="projects">
					<div className="timeline">
						<div className="line"></div>
						<div className="section">
							<div className="bead"></div>
							<div className="content">
								<div className="contentTitle">Data extraction using neural network - YOLOv3</div>
								<div className="otherDetails">
									<div>
										<b>Final year project</b>
									</div>
									<div>
										<b>Duration : </b>Jan 2021 - now
									</div>
									<div>
										<b>Tech & tools used : </b>OpenCV2, Python3, Flask, REST services, ReactJs, Darknet, CNN networks, Google Colab, YOLOv3
									</div>
								</div>
								<iframe
									src="https://www.youtube.com/embed/00eCsdMlEIY?autoplay=1&mute=1&loop=1"
									title="YouTube video player"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
								<div className="contentDesc"></div>
							</div>
						</div>

						<div className="section">
							<div className="bead"></div>
							<div className="content">
								<div className="contentTitle">Attendence using face recognition</div>
								<div className="otherDetails">
									<div>
										<b>Hobby project in 3rd year</b>
									</div>
									<div>
										<b>Duration : </b>Nov 2019 - Feb 2020{" "}
									</div>
									<div>
										<b>Tech & tools used : </b>Java8, Python3, FXML, MongoDB, Opencv2
									</div>
								</div>
								<iframe
									src="https://www.youtube.com/embed/tMkzilXs240?autoplay=1&mute=1&loop=1"
									title="YouTube video player"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
								<div className="contentDesc"></div>
							</div>
						</div>

						<div className="section">
							<div className="bead"></div>
							<div className="content">
								<div className="contentTitle">Graphics demo using GDI functions in WIN32 (Windows programming)</div>
								<div className="otherDetails">
									<div>
										<b>Hobby project in 3rd year</b>
									</div>
									<div>
										<b>Duration : </b>July 2020 - Aug 2020{" "}
									</div>
									<div>
										<b>Tech & tools used : </b>C language, CPP language, DLL, GDI, WIN32SDK
									</div>
								</div>
								<iframe
									src="https://www.youtube.com/embed/DGcWYKJQveU?autoplay=1&mute=1&loop=1"
									title="YouTube video player"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
								<div className="contentDesc"></div>
							</div>
						</div>

						<div className="section">
							<div className="bead"></div>
							<div className="content">
								<div className="contentTitle">TeslaBox@core2web</div>
								<div className="otherDetails">
									<div>
										<b>Hobby project in 3rd year</b>
									</div>
									<div>
										<b>Duration : </b>July 2020 - Aug 2020{" "}
									</div>
									<div>
										<b>Tech & tools used : </b>NodeMCU, esp8266, I2C protocol, SPI protocol, IR sensor, GAS sensor, C language, Arduino cc IDE
									</div>
								</div>
								<iframe
									src="https://www.youtube.com/embed/xza11jLh-lY?autoplay=1&mute=1&loop=1"
									title="YouTube video player"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
								<div className="contentDesc"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default PersonalProjects;
