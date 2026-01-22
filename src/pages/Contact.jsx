import React from "react"

import Footer from "../components/common/Footer"
import ContactDetails from "../components/core/ContactUsPage/ContactDetails"
import ContactForm from "../components/core/ContactUsPage/ContactForm"
import AnimatedSection from "../components/common/AnimatedSection"

const Contact = () => {
  return (
    <div className="bg-richblack-900">
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Details */}
        <AnimatedSection animation="fadeLeft" delay={0} className="lg:w-[40%]">
          <ContactDetails />
        </AnimatedSection>

        {/* Contact Form */}
        <AnimatedSection animation="fadeRight" delay={100} className="lg:w-[60%]">
          <ContactForm />
        </AnimatedSection>
      </div>
      <Footer />
    </div>
  )
}

export default Contact
