import React from 'react';
import { Link } from 'react-router-dom';
import TrackingDetails from '../../brand/Campaigns/components/TrackingDetails';
import ShippingDetails from '../../brand/Campaigns/components/ShippingDetails';

export default function ViewShipment() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/brand/shipments" className="text-gray-500 hover:underline">
              My Shipments
            </Link>
            <span className="text-gray-400">{'>'}</span>
            <span className="text-blue-600 font-medium">View Shipment</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold uppercase font-anton text-gray-900 mb-4">
                SHIPMENT ID: #289028920
              </h1>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Shipment Date</div>
                  <div className="text-sm font-medium text-gray-900">6 Jul, 2025</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Estimated Delivery</div>
                  <div className="text-sm font-medium text-gray-900">14 Jul, 2025</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <div className="inline-flex">
                    <span className="px-4 py-1 text-sm font-medium border border-green-600 bg-green-50/50 text-green-600 rounded-md">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors">
              Track Order
            </button>
          </div>

          {/* Tracking Details */}
          <TrackingDetails noContainer={true} />
        </div>

        {/* Shipping Details Table + Payment & Delivery */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <ShippingDetails noContainer={true} />

          <div className="mt-2 pt-6 border-t-4 border-gray-200">
              <div className="grid pt-2 grid-cols-1 md:grid-cols-5">
              {/* Payment */}
                <div className="md:col-span-1">
                <h3 className="text-2xl font-extrabold uppercase font-anton mb-4">PAYMENT</h3>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">Visa **56</div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                    VISA
                  </div>
                </div>
              </div>

              {/* Delivery */}
                <div className="border-t md:border-t-0 border-gray-200 md:col-span-4">
                <h3 className="text-2xl font-extrabold uppercase font-anton mb-4">DELIVERY</h3>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Address</div>
                  <div className="text-sm font-medium text-gray-900">
                    847 Jewess Bridge Apt. 174 London, UK
                  </div>
                  <div className="text-sm font-medium text-gray-900 mt-1">
                    474-769-3919
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
