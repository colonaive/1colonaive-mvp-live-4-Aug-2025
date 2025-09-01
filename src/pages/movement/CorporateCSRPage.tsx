import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Building, Users, Heart, ArrowRight } from 'lucide-react';

const RIDCRCCSRPage: React.FC = () => {
  return (
    <div className="pt-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Building className="h-12 w-12 text-white mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">RID-CRC CSR™</h1>
            <p className="text-xl mb-4">
              Corporate Sponsorship & Collaboration
            </p>
            <p className="text-md max-w-xl mx-auto">
              Partner with us to help outsmart colorectal cancer in Singapore.
              Through our CSR program, your company can sponsor modern blood-based screening for employees or underprivileged communities — and be recognised as a national health champion.
            </p>
          </div>
        </Container>
      </div>

      {/* Main Section */}
      <Container>
        <div className="max-w-5xl mx-auto py-12 space-y-12">

          {/* Tier Table */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Sponsorship Tiers</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Tier</th>
                      <th className="border px-4 py-2">Lives Reached (Est.)</th>
                      <th className="border px-4 py-2">Sponsor Benefit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-semibold text-blue-900">Gold</td>
                      <td className="border px-4 py-2">100–499 tests</td>
                      <td className="border px-4 py-2">Logo on showcase + CSR page link</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold text-indigo-900">Platinum</td>
                      <td className="border px-4 py-2">500–999 tests</td>
                      <td className="border px-4 py-2">Homepage badge + event highlight + employee story</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold text-emerald-900">Diamond</td>
                      <td className="border px-4 py-2">1000+ tests</td>
                      <td className="border px-4 py-2">Premium feature, full spotlight, media coverage</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Sponsor Value Section */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-center">What Your Company Gains</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>National visibility via our CSR Showcase and platform</li>
                <li>Custom "Proud Supporter" badge for internal/external use</li>
                <li>Dedicated sponsor feature page and spotlight story (tier-based)</li>
                <li>Optional workplace screening with in-house phlebotomist</li>
                <li>Impact report showing lives reached (aggregate only, no personal data)</li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link to="/register/corporate">
              <Button size="lg" className="group">
                Register as CSR Partner
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/csr-showcase">
              <Button variant="outline" size="lg">View Current Sponsors</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RIDCRCCSRPage;