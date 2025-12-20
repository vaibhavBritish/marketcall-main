"use client";

import DashboardLayout from "@/components/DashboardLayout";
import React, { useEffect, useState } from "react";
import useCheckAuth from "../../../../hooks/useCheckAuth";

interface Lead {
  id: string;
  fullName: string;
  category: string;
  subCategory: string;
  city: string;
  payouts: number;
  offerType: string;
  createdAt: string;
  user: {
    username?: string;
    email?: string;
  };
}

const AffiliateDashboard = () => {
  const { user, loading } = useCheckAuth({ requireRole: "AFFILIATE" });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch("/api/dashboard/affiliate");
        const data = await res.json();
        setLeads(data.leads || []);
      } catch (error) {
        console.error("Failed to fetch leads", error);
      } finally {
        setLeadsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="font-bold text-gray-700 text-2xl">
          Verifying Credentials... Please wait
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Affiliate Dashboard</h1>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow mt-6 overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Lead Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">City</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Payout</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Offer Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Posted By</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Created At</th>
            </tr>
          </thead>

          <tbody>
            {leadsLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  Loading leads...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-t cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-4 py-3">{lead.fullName}</td>
                  <td className="px-4 py-3">
                    {lead.category} / {lead.subCategory}
                  </td>
                  <td className="px-4 py-3">{lead.city}</td>
                  <td className="px-4 py-3 font-semibold">₹{lead.payouts}</td>
                  <td className="px-4 py-3 capitalize">{lead.offerType}</td>
                  <td className="px-4 py-3">
                    {lead.user?.username || lead.user?.email || "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-6">Lead Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Lead Name" value={selectedLead.fullName} />
              <Detail
                label="Category"
                value={`${selectedLead.category} / ${selectedLead.subCategory}`}
              />
              <Detail label="City" value={selectedLead.city} />
              <Detail label="Offer Type" value={selectedLead.offerType} />
              <Detail label="Payout" value={`₹${selectedLead.payouts}`} />
              <Detail
                label="Posted By"
                value={
                  selectedLead.user?.username ||
                  selectedLead.user?.email ||
                  "Unknown"
                }
              />
              <Detail
                label="Created At"
                value={new Date(selectedLead.createdAt).toLocaleString()}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

const Detail = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

export default AffiliateDashboard;
