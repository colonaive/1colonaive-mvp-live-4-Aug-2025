// src/pages/about/AdvisorsPage.tsx
import React from 'react';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Stethoscope, Award, BookOpen } from 'lucide-react';

// ✅ Public image paths
const FrancisImg = "/assets/advisors/francis-seow.jpg";
const EuImg = "/assets/advisors/eu-kong-weng.jpg";
const HoImg = "/assets/advisors/lawrence-ho.jpg";
// If you keep the space in the filename, encode it so the URL resolves
const ShabbirImg = encodeURI("/assets/advisors/shabbir-moochhala.jpg");

const advisors = [
  {
    name: "Dr. Francis Seow-Choen",
    title: "Senior Consultant Colorectal Surgeon",
    credentials: "MBBS (Singapore), FRCS (Edinburgh), FAMS (Singapore)",
    specialization: "Minimally Invasive Colorectal Surgery",
    bio:
      "Dr. Seow is a globally renowned colorectal surgeon and one of Asia's pioneers in minimally invasive colorectal surgery. He was instrumental in setting up the Department of Colorectal Surgery at Singapore General Hospital, the first independent colorectal department in Asia. Over his career, Dr. Seow has published over 200 scientific papers and numerous book chapters. He is widely regarded as an authority in colorectal cancer management, anorectal diseases, and surgical education. He also serves on editorial boards of international surgical journals and has mentored generations of colorectal surgeons across Asia.",
    icon: <Stethoscope className="h-12 w-12 text-blue-600" />,
    image: FrancisImg,
  },
  {
    name: "Prof. Eu Kong Weng",
    title: "Medical Director, Colorectal Surgeons Inc.",
    credentials: "MBBS, FRCS, FAMS",
    specialization: "Colorectal Oncology & Robotic Surgery",
    bio:
      "Prof. Eu is a distinguished colorectal surgeon with expertise in colorectal cancer surgery, advanced robotic techniques, and surgical innovation. He has trained extensively in the UK and USA, and is a key figure in advancing surgical robotics in Singapore. Prof. Eu plays an active role in colorectal cancer awareness and policy development, and has led numerous national programs to standardize surgical care and enhance early detection. His dual roles in private and public sectors reflect his deep commitment to advancing patient care and medical education in Singapore.",
    icon: <Award className="h-12 w-12 text-teal-600" />,
    image: EuImg,
  },
  {
    name: "Prof. Lawrence Ho Khek-Yu",
    title: "Senior Consultant, NUH & NCIS | Professor, NUS Medicine",
    credentials: "MBBS, MMed (Int Med), FRCP (Edin), FAMS",
    specialization: "Digestive Diseases, Early Cancer Detection & Endoscopy",
    bio:
      "Prof. Ho is an internationally respected gastroenterologist and medical thought leader. He has played a pivotal role in developing regional standards for gastrointestinal endoscopy and is actively involved in research on colorectal and gastric cancer prevention. A recipient of multiple research and teaching awards, Prof. Ho has spearheaded innovation in diagnostic tools and population health strategies. He remains deeply committed to reducing the burden of preventable cancers in Asia through early detection, screening programs, and translational medicine.",
    icon: <BookOpen className="h-12 w-12 text-purple-600" />,
    image: HoImg,
  },
  {
    name: "Prof. Shabbir Moochhala",
    title: "Adjunct Associate Professor",
    credentials:
      "BSc (Hons) Pharmacology (University of Aberdeen), PhD Pharmacology & Toxicology (Dalhousie University)",
    specialization:
      "Microbiome Research, Drug Delivery Systems, Molecular Diagnostics & Plant Sciences",
    bio:
      "Prof. Moochhala is a globally recognized pharmacologist and biomedical researcher with over three decades of distinguished experience in academia, defence research, and biotechnology entrepreneurship. He currently serves as Adjunct Associate Professor jointly at NUS Department of Surgery & Pharmacology and NTU School of Material Science & Engineering, bringing exceptional expertise in translational biomedical research. His research interests combine microbiome therapeutics, synbiotics and postbiotics, novel delivery pharmaceuticals and nutraceuticals, food safety and security, and point-of-care diagnostic development. He has made groundbreaking contributions to defence medicine, focusing on soldier performance and survivability, trauma sepsis management, and wound healing. Prof. Moochhala's extensive publication record includes recent high-impact research on gut microbiota interventions for diabetes, kidney stone disease management, and postbiotic metabolites for human health.",
    // Pick an icon color distinct from the others for visual variety
    icon: <Award className="h-12 w-12 text-emerald-600" />,
    image: ShabbirImg,
  },
];

const AdvisorsPage: React.FC = () => {
  return (
    <div className="pt-32">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Our Medical Advisory Board</h1>
            <p className="text-xl mb-0">
              Leading experts guiding Singapore&apos;s fight against colorectal cancer.
            </p>
          </div>
        </Container>
      </div>

      {/* Advisors Section */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              {advisors.map((advisor, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={advisor.image}
                          alt={advisor.name}
                          className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{advisor.name}</h2>
                        <p className="text-lg text-gray-600 mb-2">{advisor.title}</p>
                        <p className="text-sm text-blue-600 mb-4">{advisor.credentials}</p>
                        <p className="text-gray-600 mb-2">
                          <span className="font-medium">Specialization:</span> {advisor.specialization}
                        </p>
                        <p className="text-gray-700">{advisor.bio}</p>
                      </div>
                      <div className="ml-auto hidden md:block">{advisor.icon}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
              <p className="text-gray-700 mb-6">
                Our advisory board continues to grow as we work towards our Vision 2035 goals.
                Together, we&apos;re building a future where colorectal cancer is no longer a major health threat in Singapore.
              </p>
              <p className="text-blue-700 font-medium">
                More advisory board members will be announced soon.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AdvisorsPage;
