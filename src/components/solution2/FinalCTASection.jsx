import { Mail, Calendar, Clock, DollarSign } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#EDF6FA]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#101727] mb-4">
            Ready to Supercharge Your App Installs?
          </h2>

          <p className="text-sm text-[#606977] mb-6 leading-relaxed">
            Don't let your app get lost in the app store graveyard. Join the top-tier developers and marketers who are using data-driven UGC to dominate the South African mobile market.
          </p>

          <p className="text-sm text-[#606977] mb-8">
            Explore creators for free today and take the first step towards explosive app growth!
          </p>

          <button
            className="text-white h-12 px-7 rounded-full font-medium"
            style={{ backgroundColor: "#0C7BB3" }}
          >
            👉 Click Here to Explore Creators for Free
          </button>
        </div>

        {/* <Card className="p-8 bg-white border border-gray-200 rounded-2xl"> */}
        <div className="p-8 bg-white border border-[#E4E6EB] rounded-2xl">
        <h3 className="text-lg font-bold text-[#101727] mb-6 text-center">
          Looking for a Custom UGC Strategy?
        </h3>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-[#606977]">Email Us</div>
              <div className="text-sm font-semibold text-[#101727]">hello@creatorads.co.za</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-[#606977]">Book a Call</div>
              <div className="text-sm font-semibold text-[#101727]">Schedule Free Consultation</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-[#606977]">Fast Turnaround</div>
              <div className="text-sm font-semibold text-[#101727]">7-14 Days Delivery</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-xs text-[#606977]">Pricing</div>
              <div className="text-sm font-semibold text-[#101727]">From R2,500 per video</div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-[#606977]">
          Contact our South African app marketing specialists today to see how data-driven creator videos can transform your user acquisition funnel.
        </p>
      </div>
    </div>
    </section>
  );
}
