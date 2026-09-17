import React from 'react'
import Pricing from '../../components/portfolio/Home/Pricing'
import ActionButton from '../../components/common/ActionButton'
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const navigate = useNavigate();
  const handleActionClick = () => {
    navigate('/login');
  };
  return (
    <div>
      <section className="flex flex-col items-center text-center px-4 py-10">
        <div className="max-w-4xl mt-8">
          <h1 className="flex flex-wrap justify-center items-center gap-2 text-3xl md:text-5xl!">
            Our Pricing
          </h1>
          <p className="mt-4 text-xs  text-gray-600 leading-relaxed">
            Our straightforward pricing is designed to be completely transparent and affordable, with flexible options to fit any budget and scale with your needs. Whether you're a growing startup, small business, or large enterprise, we offer tailored solutions that deliver exceptional value and help you achieve your goals. Our competitive plans are structured to provide maximum impact while keeping costs predictable and manageable as you grow.
          </p>
          <div className="flex flex-col md:flex-row! items-center justify-center gap-8 mt-8">
            <ActionButton label={"Sign Up For Free"} onClick={handleActionClick} />
          </div>
        </div>
      </section>
      <section>
        <Pricing />
      </section>
    </div>
  )
}

export default PricingPage