// Singapore CRC Education Page - Multi-language Support
import React, { useState } from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { BookOpen, Users, Shield, ArrowRight, Globe, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { generateMedicalOrganizationSchema } from '../../utils/medicalSchemaGenerator';
import { HreflangGenerator } from '../../utils/hreflangGenerator';

type Language = 'en' | 'zh' | 'ms' | 'ta';

const SingaporeCRCEducation: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const schema = generateMedicalOrganizationSchema('Singapore');
  const hreflangTags = HreflangGenerator.generateHreflangTags(
    '/education/sg',
    currentLanguage,
    'Singapore',
    'colorectal cancer education singapore'
  );

  const content = {
    en: {
      title: 'Understand Colorectal Cancer in Singapore',
      subtitle: 'Comprehensive education about colorectal cancer prevention, screening, and early detection tailored for Singaporeans',
      crc101: {
        title: 'CRC 101: Understanding Colorectal Cancer',
        whatIs: {
          title: 'What is Colorectal Cancer?',
          content: 'Colorectal cancer (CRC) develops in the colon or rectum, parts of the large intestine. It is the most common cancer in Singapore for men and second most common for women, with over 1,800 new cases diagnosed annually.'
        },
        progression: {
          title: 'From Polyps to Cancer: How CRC Develops',
          content: 'Most colorectal cancers start as small growths called polyps. Over 5-10 years, some polyps can become cancerous. This slow progression makes CRC highly preventable through regular screening.'
        },
        screening: {
          title: 'Why Early Screening Matters',
          content: 'When detected early (Stage I), CRC has a 90% survival rate. However, 60% of cases in Singapore are diagnosed at late stages when treatment is more challenging and survival rates drop significantly.'
        }
      },
      localStats: {
        title: 'CRC in Singapore: Key Statistics',
        stats: [
          { label: 'New cases annually', value: '1,800+' },
          { label: 'Late-stage diagnosis rate', value: '60%' },
          { label: 'Early detection survival rate', value: '90%' },
          { label: 'Recommended screening age', value: '50+' }
        ]
      },
      nationalGuidelines: {
        title: 'Singapore National Screening Guidelines',
        content: 'The Ministry of Health (MOH) recommends CRC screening for all Singaporeans aged 50 and above. Those with family history should start screening at age 45 or 10 years before the age when their relative was diagnosed.',
        coverage: 'Screening is subsidized under various schemes including CHAS, Medisave, and Pioneer Generation packages.'
      },
      cta: {
        title: 'Take Action Today',
        subtitle: 'Early detection saves lives. Find screening options near you.',
        buttons: {
          clinic: 'Find a Screening Clinic',
          bloodTest: 'Book a Blood Test',
          specialist: 'Talk to a Specialist'
        }
      },
      footer: 'Part of the COLONAiVE™ Movement. For Lives, Not For Profits.'
    },
    zh: {
      title: '了解新加坡的大肠癌',
      subtitle: '为新加坡人量身定制的大肠癌预防、筛查和早期发现的综合教育',
      crc101: {
        title: '大肠癌基础知识：了解大肠癌',
        whatIs: {
          title: '什么是大肠癌？',
          content: '大肠癌（CRC）发生在结肠或直肠，是大肠的一部分。它是新加坡男性最常见的癌症，女性第二常见的癌症，每年诊断出超过1,800例新病例。'
        },
        progression: {
          title: '从息肉到癌症：大肠癌如何发展',
          content: '大多数大肠癌始于称为息肉的小生长物。在5-10年内，一些息肉可能变成癌症。这种缓慢的进展使得通过定期筛查高度预防大肠癌成为可能。'
        },
        screening: {
          title: '为什么早期筛查很重要',
          content: '早期发现（第一期）时，大肠癌的生存率为90%。然而，新加坡60%的病例在晚期被诊断出来，此时治疗更具挑战性，生存率显著下降。'
        }
      },
      localStats: {
        title: '新加坡大肠癌：关键统计数据',
        stats: [
          { label: '每年新增病例', value: '1,800+' },
          { label: '晚期诊断率', value: '60%' },
          { label: '早期发现生存率', value: '90%' },
          { label: '建议筛查年龄', value: '50+' }
        ]
      },
      nationalGuidelines: {
        title: '新加坡国家筛查指南',
        content: '卫生部（MOH）建议所有50岁及以上的新加坡人进行大肠癌筛查。有家族史的人应在45岁或比其亲属被诊断年龄早10年开始筛查。',
        coverage: '筛查在包括CHAS、保健储蓄和建国一代配套等各种计划下获得补贴。'
      },
      cta: {
        title: '今天就采取行动',
        subtitle: '早期发现拯救生命。找到您附近的筛查选项。',
        buttons: {
          clinic: '寻找筛查诊所',
          bloodTest: '预约血液检测',
          specialist: '咨询专科医生'
        }
      },
      footer: 'COLONAiVE™ 运动的一部分。为了生命，不为了利润。'
    },
    ms: {
      title: 'Memahami Kanser Kolorektal di Singapura',
      subtitle: 'Pendidikan komprehensif tentang pencegahan, saringan, dan pengesanan awal kanser kolorektal yang disesuaikan untuk rakyat Singapura',
      crc101: {
        title: 'Asas Kanser Kolorektal: Memahami Kanser Kolorektal',
        whatIs: {
          title: 'Apakah Kanser Kolorektal?',
          content: 'Kanser kolorektal (CRC) berkembang dalam kolon atau rektum, bahagian usus besar. Ia adalah kanser yang paling biasa di Singapura untuk lelaki dan kedua paling biasa untuk wanita, dengan lebih 1,800 kes baru didiagnosis setiap tahun.'
        },
        progression: {
          title: 'Dari Polip ke Kanser: Bagaimana CRC Berkembang',
          content: 'Kebanyakan kanser kolorektal bermula sebagai pertumbuhan kecil yang dipanggil polip. Selama 5-10 tahun, beberapa polip boleh menjadi kanser. Perkembangan yang perlahan ini menjadikan CRC sangat boleh dicegah melalui saringan berkala.'
        },
        screening: {
          title: 'Mengapa Saringan Awal Penting',
          content: 'Apabila dikesan awal (Tahap I), CRC mempunyai kadar survival 90%. Walau bagaimanapun, 60% kes di Singapura didiagnosis pada peringkat lewat apabila rawatan lebih mencabar dan kadar survival menurun dengan ketara.'
        }
      },
      localStats: {
        title: 'CRC di Singapura: Statistik Utama',
        stats: [
          { label: 'Kes baru setiap tahun', value: '1,800+' },
          { label: 'Kadar diagnosis lewat', value: '60%' },
          { label: 'Kadar survival pengesanan awal', value: '90%' },
          { label: 'Umur saringan yang disyorkan', value: '50+' }
        ]
      },
      nationalGuidelines: {
        title: 'Garis Panduan Saringan Kebangsaan Singapura',
        content: 'Kementerian Kesihatan (MOH) mengesyorkan saringan CRC untuk semua rakyat Singapura berumur 50 tahun ke atas. Mereka yang mempunyai sejarah keluarga harus memulakan saringan pada umur 45 tahun atau 10 tahun sebelum umur ketika saudara mereka didiagnosis.',
        coverage: 'Saringan disubsidi di bawah pelbagai skim termasuk CHAS, Medisave, dan pakej Generasi Perintis.'
      },
      cta: {
        title: 'Ambil Tindakan Hari Ini',
        subtitle: 'Pengesanan awal menyelamatkan nyawa. Cari pilihan saringan berhampiran anda.',
        buttons: {
          clinic: 'Cari Klinik Saringan',
          bloodTest: 'Tempah Ujian Darah',
          specialist: 'Bercakap dengan Pakar'
        }
      },
      footer: 'Sebahagian daripada Gerakan COLONAiVE™. For Lives, Not For Profits.'
    },
    ta: {
      title: 'சிங்கப்பூரில் பெருங்குடல் புற்றுநோயைப் புரிந்துகொள்ளுங்கள்',
      subtitle: 'சிங்கப்பூரர்களுக்காக வடிவமைக்கப்பட்ட பெருங்குடல் புற்றுநோய் தடுப்பு, பரிசோதனை மற்றும் ஆரம்ப கண்டறிதல் பற்றிய விரிவான கல்வி',
      crc101: {
        title: 'CRC 101: பெருங்குடல் புற்றுநோயைப் புரிந்துகொள்ளுதல்',
        whatIs: {
          title: 'பெருங்குடல் புற்றுநோய் என்றால் என்ன?',
          content: 'பெருங்குடல் புற்றுநோய் (CRC) பெருங்குடலின் பகுதிகளான கோலன் அல்லது மலக்குடலில் உருவாகிறது. இது சிங்கப்பூரில் ஆண்களுக்கு மிகவும் பொதுவான புற்றுநோயும், பெண்களுக்கு இரண்டாவது பொதுவான புற்றுநோயும் ஆகும், ஆண்டுதோறும் 1,800க்கும் மேற்பட்ட புதிய வழக்குகள் கண்டறியப்படுகின்றன.'
        },
        progression: {
          title: 'பாலிப்களிலிருந்து புற்றுநோயாக: CRC எவ்வாறு உருவாகிறது',
          content: 'பெரும்பாலான பெருங்குடல் புற்றுநோய்கள் பாலிப்கள் எனப்படும் சிறிய வளர்ச்சிகளாகத் தொடங்குகின்றன. 5-10 ஆண்டுகளில், சில பாலிப்கள் புற்றுநோயாக மாறலாம். இந்த மெதுவான முன்னேற்றம் வழக்கமான பரிசோதனையின் மூலம் CRC ஐ மிகவும் தடுக்கக்கூடியதாக ஆக்குகிறது.'
        },
        screening: {
          title: 'ஆரம்ப பரிசோதனை ஏன் முக்கியம்',
          content: 'ஆரம்பத்தில் கண்டறியப்படும் போது (நிலை I), CRC 90% உயிர்வாழ்வு விகிதத்தைக் கொண்டுள்ளது. இருப்பினும், சிங்கப்பூரில் 60% வழக்குகள் தாமதமான நிலைகளில் கண்டறியப்படுகின்றன, அப்போது சிகிச்சை மிகவும் சவாலானது மற்றும் உயிர்வாழ்வு விகிதங்கள் கணிசமாகக் குறைகின்றன.'
        }
      },
      localStats: {
        title: 'சிங்கப்பூரில் CRC: முக்கிய புள்ளிவிவரங்கள்',
        stats: [
          { label: 'ஆண்டுதோறும் புதிய வழக்குகள்', value: '1,800+' },
          { label: 'தாமதமான கண்டறிதல் விகிதம்', value: '60%' },
          { label: 'ஆரம்ப கண்டறிதல் உயிர்வாழ்வு விகிதம்', value: '90%' },
          { label: 'பரிந்துரைக்கப்பட்ட பரிசோதனை வயது', value: '50+' }
        ]
      },
      nationalGuidelines: {
        title: 'சிங்கப்பூர் தேசிய பரிசோதனை வழிகாட்டுதல்கள்',
        content: 'சுகாதார அமைச்சகம் (MOH) 50 வயது மற்றும் அதற்கு மேற்பட்ட அனைத்து சிங்கப்பூரர்களுக்கும் CRC பரிசோதனையை பரிந்துரைக்கிறது. குடும்ப வரலாறு உள்ளவர்கள் 45 வயதிலோ அல்லது அவர்களின் உறவினர் கண்டறியப்பட்ட வயதுக்கு 10 ஆண்டுகள் முன்பு பரிசோதனையைத் தொடங்க வேண்டும்.',
        coverage: 'CHAS, Medisave மற்றும் Pioneer Generation பொதிகள் உட்பட பல்வேறு திட்டங்களின் கீழ் பரிசோதனை மானியம் வழங்கப்படுகிறது.'
      },
      cta: {
        title: 'இன்றே நடவடிக்கை எடுங்கள்',
        subtitle: 'ஆரம்ப கண்டறிதல் உயிர்களைக் காப்பாற்றுகிறது. உங்களுக்கு அருகில் உள்ள பரிசோதனை விருப்பங்களைக் கண்டறியுங்கள்.',
        buttons: {
          clinic: 'பரிசோதனை கிளினிக்கைக் கண்டறியுங்கள்',
          bloodTest: 'இரத்த பரிசோதனையை முன்பதிவு செய்யுங்கள்',
          specialist: 'நிபுணருடன் பேசுங்கள்'
        }
      },
      footer: 'COLONAiVE™ இயக்கத்தின் ஒரு பகுதி. வாழ்க்கைக்காக, லாபத்துக்காக அல்ல.'
    }
  } as const;

  const currentContent = content[currentLanguage];

  const LanguageSwitcher = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      <span className="text-sm text-gray-600 mr-2">Language:</span>
      {Object.entries({
        en: 'English',
        zh: '中文',
        ms: 'Bahasa Melayu',
        ta: 'தமிழ்'
      }).map(([lang, label]) => (
        <button
          key={lang}
          onClick={() => setCurrentLanguage(lang as Language)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            currentLanguage === lang
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Hreflang Tags */}
      {hreflangTags.map((tag, index) => (
        <link
          key={`hreflang-${index}`}
          rel="alternate"
          hrefLang={tag.hreflang}
          href={tag.url}
        />
      ))}

      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 text-white py-16">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <LanguageSwitcher />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {currentContent.title}
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                {currentContent.subtitle}
              </p>
              <div className="flex items-center justify-center space-x-4 text-blue-200">
                <BookOpen className="h-6 w-6" />
                <span>Educational Resource</span>
                <Globe className="h-6 w-6" />
                <span>Singapore Health Authority Aligned</span>
              </div>
            </div>
          </Container>
        </section>

        {/* CRC 101 Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {currentContent.crc101.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card className="border-t-4 border-blue-500">
                  <CardContent className="p-6">
                    <Heart className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">
                      {currentContent.crc101.whatIs.title}
                    </h3>
                    <p className="text-gray-600">
                      {currentContent.crc101.whatIs.content}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-orange-500">
                  <CardContent className="p-6">
                    <AlertCircle className="h-12 w-12 text-orange-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">
                      {currentContent.crc101.progression.title}
                    </h3>
                    <p className="text-gray-600">
                      {currentContent.crc101.progression.content}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-green-500">
                  <CardContent className="p-6">
                    <Shield className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">
                      {currentContent.crc101.screening.title}
                    </h3>
                    <p className="text-gray-600">
                      {currentContent.crc101.screening.content}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Visual Aid Placeholder */}
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Heart className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Colon & Polyp Development Diagram</p>
                    <p className="text-sm text-gray-400">Interactive visual showing polyp-to-cancer progression</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Local Statistics */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {currentContent.localStats.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {currentContent.localStats.stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-md text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                    <p className="text-gray-700">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* National Guidelines */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-4">
                  {currentContent.nationalGuidelines.title}
                </h2>
                <p className="text-lg text-blue-100 mb-4">
                  {currentContent.nationalGuidelines.content}
                </p>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-100">
                    {currentContent.nationalGuidelines.coverage}
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-800 to-indigo-700 text-white">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {currentContent.cta.title}
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                {currentContent.cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/specialists">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    {currentContent.cta.buttons.clinic}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="/get-screened">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                    {currentContent.cta.buttons.bloodTest}
                  </Button>
                </a>
                <a href="/specialists">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-800">
                    {currentContent.cta.buttons.specialist}
                  </Button>
                </a>
              </div>
              
              {/* Internal Links */}
              <div className="mt-12 pt-8 border-t border-blue-700">
                <p className="text-blue-200 mb-4">Learn More:</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a href="/education/patients/colorectal-cancer" className="text-blue-200 hover:text-white underline">
                    Understanding Colorectal Cancer
                  </a>
                  <a href="/get-screened" className="text-blue-200 hover:text-white underline">
                    Get Screened
                  </a>
                  <a href="/specialists" className="text-blue-200 hover:text-white underline">
                    Find Specialists
                  </a>
                  <a href="/movement-pillars" className="text-blue-200 hover:text-white underline">
                    Movement Pillars
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <Container>
            <div className="text-center">
              <p className="text-gray-300">
                {currentContent.footer}
              </p>
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
};

export default SingaporeCRCEducation;