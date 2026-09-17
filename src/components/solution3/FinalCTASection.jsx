import { Mail, Calendar, Clock, DollarSign } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-cyan-50"
      style={{ fontFamily: "Manrope" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Supercharge Your App Installs?
          </h2>

          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Don't let your app get lost in the app store graveyard. Join the top-tier developers and marketers who are using data-driven UGC to dominate the South African mobile market.
          </p>

          <p className="text-sm text-gray-700 mb-8">
            Explore creators for free today and take the first step towards explosive app growth!
          </p>

          <button className="h-12 px-7 rounded-full bg-[#0C7BBC] text-white text-[16px] font-medium hover:bg-[#0A6CA7] transition-all duration-300">
            👉 Click Here to Explore Creators for Free
          </button>
        </div>

        <div className="p-8 bg-white border border-gray-200 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
            Looking for a Custom UGC Strategy?
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Email Us</div>
                <div className="text-sm font-semibold text-gray-900">hello@creatorads.co.za</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Book a Call</div>
                <div className="text-sm font-semibold text-gray-900">Schedule Free Consultation</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Fast Turnaround</div>
                <div className="text-sm font-semibold text-gray-900">7-14 Days Delivery</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Pricing</div>
                <div className="text-sm font-semibold text-gray-900">From R2,500 per video</div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Contact our South African app marketing specialists today to see how data-driven creator videos can transform your user acquisition funnel.
          </p>
        </div>
      </div>
    </section>
  );
}
