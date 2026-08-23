import { useState } from "react";

import {
  MapPin,
  Phone,
  Mail,
  Users,
  Briefcase,
  MessageSquare,
  Rocket,
  MessageCircle,
} from "lucide-react";

const contactCards = [
    {
        icon: Briefcase,
        title: 'Talk to Sales',
        description: "Ready to start a project? Let's discuss your needs.",
        email: 'sales@creatrend.co.za',
        color: 'from-blue-50 to-blue-100/50'
    },
    {
        icon: Rocket,
        title: 'Join the Team',
        description: 'Looking for your next big career move?',
        email: 'careers@creatrend.co.za',
        color: 'from-purple-50 to-purple-100/50'
    },
    {
        icon: MessageCircle,
        title: 'General Inquiries',
        description: 'Have a quick question or just want to connect?',
        email: 'hello@creatrend.co.za',
        color: 'from-teal-50 to-teal-100/50'
    }
];

export default function ContactHero() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        inquiryType: "Talk to Sales",
        message: "",
    });

    const handleSubmit = () => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                    Let's create something
                    <span className="block bg-gradient-to-r from-[#0C7BBC] to-[#0a90d8] bg-clip-text text-transparent">
                        great together.
                    </span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                    Whether you're looking to scale your business, join our growing team,
                    or simply say hello—we'd love to hear from you.
                </p>
            </div>

            {/* Contact Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-20">
                {contactCards.map((card, index) => (
                    <div
                        key={index}
                        className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-[#0C7BBC]/20 overflow-hidden"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#0C7BBC] to-[#0a90d8] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                <card.icon className="w-7 h-7 text-white" strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                            <p className="text-slate-600 mb-4 leading-relaxed">{card.description}</p>
                            <a
                                href={`mailto:${card.email}`}
                                className="text-[#0C7BBC] hover:text-[#0a5d94] font-medium inline-flex items-center gap-1 group/link"
                            >
                                {card.email}
                                <span className="group-hover/link:translate-x-1 transition-transform duration-200">→</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Send a Message Form */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <input
                                type="text"
                                placeholder="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C7BBC]/20 focus:border-[#0C7BBC] transition-all"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C7BBC]/20 focus:border-[#0C7BBC] transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-700 mb-2 font-medium">I am looking to...</label>
                            <select
                                value={formData.inquiryType}
                                onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C7BBC]/20 focus:border-[#0C7BBC] transition-all appearance-none cursor-pointer"
                            >
                                <option>Talk to Sales</option>
                                <option>Inquire about a Career</option>
                                <option>Ask a general question</option>
                            </select>
                        </div>
                        <div>
                            <textarea
                                placeholder="Message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={5}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C7BBC]/20 focus:border-[#0C7BBC] transition-all resize-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-[#0C7BBC] to-[#0a90d8] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#0C7BBC]/25 active:scale-[0.98] transition-all duration-200"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Visit Us */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Visit Us</h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-3">Creatrend (PTY) LTD</h3>
                            <div className="flex items-start gap-3 text-slate-600 mb-4">
                                <MapPin className="w-5 h-5 text-[#0C7BBC] flex-shrink-0 mt-0.5" />
                                <span>Cape Town, South Africa</span>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="relative h-64 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d211868.87364129525!2d18.3097215!3d-33.9288166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc500f8826eed7%3A0x687fe1fc2828aa87!2sCape%20Town%2C%20South%20Africa!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Cape Town Location"
                                className="w-full h-full"
                            />
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <a
                                href="tel:+27785582222"
                                className="flex items-center gap-3 text-slate-700 hover:text-[#0C7BBC] transition-colors group"
                            >
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-[#0C7BBC]/10 transition-colors">
                                    <Phone className="w-5 h-5 text-[#0C7BBC]" />
                                </div>
                                <span>+27 78 558 222</span>
                            </a>
                            <a
                                href="mailto:hello@creatrend.co.za"
                                className="flex items-center gap-3 text-slate-700 hover:text-[#0C7BBC] transition-colors group"
                            >
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-[#0C7BBC]/10 transition-colors">
                                    <Mail className="w-5 h-5 text-[#0C7BBC]" />
                                </div>
                                <span>hello@creatrend.co.za</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
