import React from "react";

class Projects extends React.Component {
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
			<div className="projectWrapper">
				<div className="projects__title">Projects</div>
				<div className="projects">
					<div className="timeline">
						<div className="line"></div>
						<div className="section">
							<div className="bead"></div>
							<div className="content">
								<div className="contentTitle">BeeGuide - Build beautiful product tours</div>
								<div className="otherDetails">
									<a href="https://ssmui-beeguide.saashub.us-south.containers.appdomain.cloud/">Live preview</a>
									<div>
										<b>Side project</b>
									</div>
									<div>
										<b>Duration : </b>June 2022 - July 2022{" "}
									</div>
									<div>
										<b>Tech & tools used : </b>ReactJs - Hooks, NextJs, Docker, HTML/CSS, Figma, Mobile responsive, NodeJs, ExpressJs, MongoDB, Carbon Design by IBM, Travis CI/CD,
										IBM Kubernetes Service (IBM Cloud)
									</div>
									<div>
										This app consists of 3 things <br />
										1. Chrome extention - used to create product tours on our webapp 2. Landing page + Docs + tours management - This provides tool information, documentation, tour
										management view 3. Remote JS Script - This is used to integrate the tours with yout website
									</div>
								</div>
								<iframe
									width="560"
									height="315"
									src="https://www.youtube.com/embed/Y1SvkALnIHM?autoplay=1&mute=1&loop=1"
									title="YouTube video player"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowfullscreen
								></iframe>
								<div className="contentDesc"></div>
							</div>
						</div>

						<div className="section">
							<div className="bead"></div>
							<div className="content">
								<div className="contentTitle">BlaBla - Realtime chatting(ongoing)</div>
								<div className="otherDetails">
									<div>
										<b>Side project</b>
									</div>
									<div>
										<b>Duration : </b>Nov 2021 - Jan 2021{" "}
									</div>
									<div>
										<b>Tech & tools used : </b>ReactJs - Hooks, NextJs, SSR, Vercel, Docker, Socket.io, Redis, Redux, HTML/CSS, Figma, Mobile responsive, NodeJs, ExpressJs,
										MongoDB, JWT
									</div>
								</div>
								<iframe
									width="560"
									height="315"
									src="https://www.youtube.com/embed/OZ1Sk_tqKFs?autoplay=1&mute=1&loop=1"
									title="YouTube video player"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowfullscreen
								></iframe>
								<div className="contentDesc"></div>
							</div>
						</div>

						<div className="section">
							<div className="bead"></div>
							<div className="content">
								<div className="contentTitle">360nearme </div>
								<div className="otherDetails">
									<div>
										<b>Hobby project</b>
									</div>
									<div>
										<b>Duration : </b>April 2021 - May 2021{" "}
									</div>
									<div>
										<b>Tech & tools used : </b>ReactJs - Hooks,NextJs,SSR, Redux, HTML/CSS, Figma, Mobile responsive, NodeJs, ExpressJs, PanellumJs, MongoDB, Firebase, JWT
									</div>
								</div>
								<iframe
									src="https://www.youtube.com/embed/zuclDjKXDQc?autoplay=1&mute=1&loop=1"
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
								<div className="contentTitle">Core2web professional network (ongoing)</div>
								<div className="otherDetails">
									<div>
										<b>Company : </b> Biencaps Systems Pvt. Ltd.{" "}
									</div>
									<div>
										<b>Duration : </b>Feb 2021 - June 2021{" "}
									</div>
									<div>
										<b>Tech & tools used : </b>ReactJs - Class based components, Redux, HTML/CSS, Figma, Mobile responsive, Firebase, JWT
									</div>
								</div>
								<iframe
									src="https://www.youtube.com/embed/NokDmGnS7I0?autoplay=1&mute=1&loop=1"
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
								<div className="contentTitle">WashMartIndia.com</div>
								<div className="otherDetails">
									<div>
										<b>Company : </b> Biencaps Systems Pvt. Ltd.{" "}
									</div>
									<div>
										<b>Duration : </b>Nov 2020 - Jan 2021{" "}
									</div>
									<div>
										<b>Tech & tools used : </b>ReactJs, Redux, HTML/CSS, Firebase, JWT
									</div>
								</div>
								<iframe
									src="https://www.youtube.com/embed/W05xEu_Nu9E?autoplay=1&mute=1&loop=1"
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
								<div className="contentTitle">biencaps.com</div>
								<div className="otherDetails">
									<div>
										<b>Company : </b> Biencaps Systems Pvt. Ltd.{" "}
									</div>
									<div>
										<b>Duration : </b>Oct 2020 - Nov 2020{" "}
									</div>
									<div>
										<b>Tech & tools used : </b>ReactJs, Redux, HTML/CSS, Firebase, JWT
									</div>
								</div>
								<iframe
									src="https://www.youtube.com/embed/d_pdpTbTiA0?autoplay=1&mute=1&loop=1"
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
								<div className="contentTitle">A Chrome data entry extention to fill dummy data</div>
								<div className="otherDetails">
									<div>
										<b>Hobby project</b>
									</div>
									<div>
										<b>Duration : </b>Aug 2020 - Sept 2020{" "}
									</div>
									<div>
										<b>Tech & tools used : </b>ReactJs, HTML/CSS, FakerJs,
									</div>
								</div>
								<iframe
									width="560"
									height="315"
									src="https://www.youtube.com/embed/6VBke4m8rRY?autoplay=1&mute=1&loop=1"
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
								<div className="contentTitle">SortingVisualiser in vanilla js</div>
								<div className="otherDetails">
									<div>
										<b>Hobby project</b>
									</div>
									<div>
										<b>Duration : </b>May 2020 - Jun 2020{" "}
									</div>
									<div>
										<b>Tech & tools used : </b> HTML/CSS, Vanilla Js, p5js,
									</div>
								</div>
								<iframe
									src="https://www.youtube.com/embed/ydsXlvOISE8?autoplay=1&mute=1&loop=1"
									title="YouTube video player"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
								<div className="contentDesc"></div>
							</div>
						</div>
					</div>
					<script src="../timeline.js"></script>
				</div>
			</div>
		);
	}
}

export default Projects;
