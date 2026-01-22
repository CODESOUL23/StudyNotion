import React from "react"

import FoundingStory from "../assets/Images/FoundingStory.png"
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"
import Footer from "../components/common/Footer"
import HighlightText from "../components/core/HomePage/HighlightText"
import AnimatedSection from "../components/common/AnimatedSection"

const About = () => {
  return (
    <div>
      <section className="bg-richblack-700">
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">
          <AnimatedSection animation="fadeUp" delay={0}>
            <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
              Driving Innovation in Online Education for a
              <HighlightText text={"Brighter Future"} />
              <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
                Studynotion is at the forefront of driving innovation in online
                education. We're passionate about creating a brighter future by
                offering cutting-edge courses, leveraging emerging technologies,
                and nurturing a vibrant learning community.
              </p>
            </header>
          </AnimatedSection>
          <div className="sm:h-[70px] lg:h-[150px]"></div>
          <div className="absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
            <AnimatedSection animation="scale" delay={100}>
              <img src={BannerImage1} alt="" className="hover:scale-105 transition-transform duration-300 w-full" />
            </AnimatedSection>
            <AnimatedSection animation="scale" delay={200}>
              <img src={BannerImage2} alt="" className="hover:scale-105 transition-transform duration-300 w-full" />
            </AnimatedSection>
            <AnimatedSection animation="scale" delay={300}>
              <img src={BannerImage3} alt="" className="hover:scale-105 transition-transform duration-300 w-full" />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="border-b border-richblack-700">
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="h-[100px] "></div>
          <AnimatedSection animation="fadeUp" delay={0}>
            <blockquote className="text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white">
              "We are passionate about revolutionizing the way we learn. Our innovative platform{" "}
              <HighlightText text={"combines technology"} />, {" "}
              <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
                expertise
              </span>
              , and community to create an{" "}
              <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
                unparalleled educational experience.
              </span> 
            </blockquote>
          </AnimatedSection>
        </div>
      </section>

      <section>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
            <AnimatedSection animation="fadeLeft" delay={0} className="my-24 flex lg:w-[50%] flex-col gap-10">
              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Founding Story
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Our e-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evolving digital world.
              </p>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems. We
                believed that education should not be confined to the walls of a
                classroom or restricted by geographical boundaries. We
                envisioned a platform that could bridge these gaps and empower
                individuals from all walks of life to unlock their full
                potential.
              </p>
            </AnimatedSection>

            <AnimatedSection animation="fadeRight" delay={100}>
              <img
                src={FoundingStory}
                alt=""
                className="shadow-[0_0_20px_0] shadow-[#FC6767]"
              />
            </AnimatedSection>
          </div>
          <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
            <AnimatedSection animation="fadeLeft" delay={0} className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Vision
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people
                learn. Our team of dedicated experts worked tirelessly to
                develop a robust and intuitive platform that combines
                cutting-edge technology with engaging content, fostering a
                dynamic and interactive learning experience.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fadeRight" delay={100} className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
              Our Mission
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
              Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-richblack-700">
        <div className="flex flex-col gap-10 justify-between w-11/12 max-w-maxContent text-white mx-auto ">
          <AnimatedSection animation="fadeUp" delay={0} className="grid grid-cols-2 md:grid-cols-4 text-center">
            <div className="flex flex-col py-10">
              <h1 className="text-[30px] font-bold text-richblack-5">
                5K
              </h1>
              <h2 className="font-semibold text-[16px] text-richblack-500">
                Active Students
              </h2>
            </div>
            <div className="flex flex-col py-10">
              <h1 className="text-[30px] font-bold text-richblack-5">
                10+
              </h1>
              <h2 className="font-semibold text-[16px] text-richblack-500">
                Mentors
              </h2>
            </div>
            <div className="flex flex-col py-10">
              <h1 className="text-[30px] font-bold text-richblack-5">
                200+
              </h1>
              <h2 className="font-semibold text-[16px] text-richblack-500">
                Courses
              </h2>
            </div>
            <div className="flex flex-col py-10">
              <h1 className="text-[30px] font-bold text-richblack-5">
                50+
              </h1>
              <h2 className="font-semibold text-[16px] text-richblack-500">
                Awards
              </h2>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Learning Section */}
      <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white mb-20">
        <AnimatedSection animation="fadeUp" delay={0} className="grid mx-auto w-[350px] lg:w-fit grid-cols-1 lg:grid-cols-4 mb-12">
          <div className="lg:col-span-2 lg:h-[294px] p-8 bg-richblack-800 hover:bg-richblack-700 transition-colors duration-300">
            <h1 className="text-richblack-5 text-lg font-semibold">
              World-Class Learning for{" "}
              <HighlightText text={"Anyone, Anywhere"} />
            </h1>
            <p className="text-richblack-300 font-medium mt-3">
              Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.
            </p>
            <div className="w-fit mt-8">
              <button className="bg-yellow-50 text-richblack-900 font-semibold px-6 py-3 rounded-md hover:scale-95 transition-transform">
                Learn More
              </button>
            </div>
          </div>
          <div className="lg:col-span-2 lg:h-[294px] p-8 bg-richblack-900 hover:bg-richblack-800 transition-colors duration-300">
            <h1 className="text-richblack-5 text-lg font-semibold">
              Our Teaching Method
            </h1>
            <p className="text-richblack-300 font-medium mt-3">
              Our innovative teaching method combines cutting-edge technology with expert instruction to create an engaging learning experience.
            </p>
          </div>
          <div className="lg:col-span-2 lg:h-[294px] p-8 bg-richblack-900 hover:bg-richblack-800 transition-colors duration-300">
            <h1 className="text-richblack-5 text-lg font-semibold">
              Certification
            </h1>
            <p className="text-richblack-300 font-medium mt-3">
              Get certified and showcase your achievements to potential employers and peers.
            </p>
          </div>
          <div className="lg:col-span-2 lg:h-[294px] p-8 bg-richblack-800 hover:bg-richblack-700 transition-colors duration-300">
            <h1 className="text-richblack-5 text-lg font-semibold">
              Rating & Reviews
            </h1>
            <p className="text-richblack-300 font-medium mt-3">
              Read reviews from our students and see how Studynotion has helped them achieve their goals.
            </p>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  )
}

export default About
