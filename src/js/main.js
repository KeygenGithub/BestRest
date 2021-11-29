import "./modules/init-form";
import "./modules/scroll";
import Parallax from "parallax-js";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

$(function() {
    const parallaxScenes = document.querySelectorAll(".parallax-scene");
    parallaxScenes.forEach((scene) => {
        let parallaxInstance = new Parallax(scene);
    });

    gsap.timeline({
            scrollTrigger: {
                trigger: "#form",
                start: "center bottom"
            }
        })
        .to(".form__group", { opacity: 1, stagger: .2, y: 0, ease: "expo.out", duration: .6 })
});