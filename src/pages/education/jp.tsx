// Japan CRC Education Page - English & Japanese Support
import React, { useMemo, useState } from "react";
import { Container } from "../../components/ui/Container";
import { Card, CardContent } from "../../components/ui/Card";
import {
  BookOpen,
  Shield,
  ArrowRight,
  Globe,
  Heart,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Building,
} from "lucide-react";
import { generateMedicalOrganizationSchema } from "../../utils/medicalSchemaGenerator";

type Language = "ja" | "en";

type HreflangTag = {
  hreflang: string;
  url: string;
};

const JapanCRCEducation: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("ja");
  const schema = generateMedicalOrganizationSchema("Japan");

  // Local, explicit hreflang tags (keeps types strict and avoids util mismatch)
  const hreflangTags: HreflangTag[] = useMemo(
    () => [
      { hreflang: "ja-JP", url: "/education/jp?lang=ja" },
      { hreflang: "en-JP", url: "/education/jp?lang=en" },
      // Optional x-default points to the primary language
      { hreflang: "x-default", url: "/education/jp" },
    ],
    []
  );

  const content = {
    ja: {
      title: "日本における大腸がんを理解する",
      subtitle:
        "日本人に向けた大腸がんの予防、検診、早期発見に関する総合的な教育",
      crc101: {
        title: "大腸がん基礎知識：大腸がんを理解する",
        whatIs: {
          title: "大腸がんとは何ですか？",
          content:
            "大腸がん（CRC）は、大腸の一部である結腸または直腸に発生します。日本では大腸がんは最も診断されるがんで、年間14万7000人以上の新規患者が発生しています。",
        },
        progression: {
          title: "ポリープからがんへ：大腸がんの発達過程",
          content:
            "ほとんどの大腸がんは、ポリープと呼ばれる小さな成長物から始まります。5〜10年にわたって、一部のポリープががんになることがあります。定期的な検診により、ポリープががんになる前に発見・除去することができます。",
        },
        screening: {
          title: "日本で早期検診が重要な理由",
          content:
            "日本の高齢化社会に伴い、今後10年間で大腸がんの症例は15％増加すると予想されています。国の検診プログラムへの参加率は45％にとどまり、WHO推奨値を下回っています。",
        },
      },
      localStats: {
        title: "日本の大腸がん：主要統計",
        stats: [
          { label: "年間新規症例", value: "147,000+" },
          { label: "年間死亡者数", value: "53,000+" },
          { label: "5年生存率", value: "72.9%" },
          { label: "検診参加率", value: "45%" },
        ],
      },
      riskFactors: {
        title: "日本における増加するリスク要因",
        factors: [
          "高齢化人口によるがんリスクの増加",
          "加工食品を多く含む食生活の西洋化",
          "都市部での身体活動の減少",
          "特定の集団における遺伝的素因",
          "高い仕事のストレスと不規則な食習慣",
        ],
      },
      nationalSystem: {
        title: "国民健康保険制度と検診",
        content:
            "日本の国民健康保険制度は基本的な大腸がん検診をカバーしていますが、高度な血液ベースの検査はより高い精度と利便性を提供します。",
        coverage:
            "便潜血検査は国民健康保険でカバーされ、年1回の検診が推奨されています。血液ベースの検査は自費診療となりますが、高い精度を提供します。",
        facilities:
            "全国の主要病院やクリニックで検診が利用可能で、47都道府県すべてで検診サービスが提供されています。",
      },
      cta: {
        title: "今すぐ行動を起こしましょう",
        subtitle:
            "早期発見が命を救います。日本全国の検診オプションを見つけてください。",
        buttons: {
          clinic: "検診センターを探す",
          bloodTest: "血液検査を予約",
          specialist: "専門医に相談",
        },
      },
      footer: "COLONAiVE™運動の一部。命のために、利益のためではなく。",
    },
    en: {
      title: "Understand Colorectal Cancer in Japan",
      subtitle:
        "Comprehensive education about colorectal cancer prevention, screening, and early detection tailored for Japan",
      crc101: {
        title: "CRC 101: Understanding Colorectal Cancer",
        whatIs: {
          title: "What is Colorectal Cancer?",
          content:
            "Colorectal cancer (CRC) develops in the colon or rectum. In Japan, CRC is the most diagnosed cancer, with over 147,000 new cases annually.",
        },
        progression: {
          title: "From Polyps to Cancer: How CRC Develops",
          content:
            "Most colorectal cancers start as small growths called polyps. Over 5-10 years, some polyps can turn cancerous. Regular screening can detect and remove polyps early.",
        },
        screening: {
          title: "Why Early Screening Matters in Japan",
          content:
            "With an aging society, CRC cases may rise ~15% over the next decade. National screening participation is ~45%, below WHO recommendations.",
        },
      },
      localStats: {
        title: "CRC in Japan: Key Statistics",
        stats: [
          { label: "New cases annually", value: "147,000+" },
          { label: "Deaths annually", value: "53,000+" },
          { label: "5-year survival rate", value: "72.9%" },
          { label: "Screening participation", value: "45%" },
        ],
      },
      riskFactors: {
        title: "Growing Risk Factors in Japan",
        factors: [
          "Aging population with increased cancer risk",
          "Westernization of diet (more processed foods)",
          "Reduced physical activity in urban areas",
          "Genetic predisposition in certain populations",
          "High work stress and irregular eating patterns",
        ],
      },
      nationalSystem: {
        title: "National Health Insurance & Screening",
        content:
            "Japan's National Health Insurance covers basic CRC screening; blood-based tests offer higher convenience/accuracy (typically self-pay).",
        coverage:
            "FOBT/FIT is covered by NHI (annual screening recommended). Blood-based options are usually self-pay.",
        facilities:
            "Screening is available at major hospitals/clinics nationwide across all 47 prefectures.",
      },
      cta: {
        title: "Take Action Today",
        subtitle: "Early detection saves lives. Find screening options across Japan.",
        buttons: {
          clinic: "Find Screening Centers",
          bloodTest: "Book Blood Test",
          specialist: "Consult Specialists",
        },
      },
      footer: "Part of the COLONAiVE™ Movement. For Lives, Not For Profits.",
    },
  } as const;

  const currentContent = content[currentLanguage];

  const LanguageSwitcher = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      <span className="text-sm text-gray-600 mr-2">言語 / Language:</span>
      {Object.entries({ ja: "日本語", en: "English" }).map(([lang, label]) => (
        <button
          key={lang}
          onClick={() => setCurrentLanguage(lang as Language)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            currentLanguage === lang
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
      {hreflangTags.map((tag: HreflangTag, index: number) => (
        <link key={`hreflang-${index}`} rel="alternate" hrefLang={tag.hreflang} href={tag.url} />
      ))}

      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-r from-red-900 via-red-800 to-orange-700 text-white py-16">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <LanguageSwitcher />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{currentContent.title}</h1>
              <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
                {currentContent.subtitle}
              </p>
              <div className="flex items-center justify-center space-x-4 text-red-200">
                <BookOpen className="h-6 w-6" />
                <span>Educational Resource</span>
                <Globe className="h-6 w-6" />
                <span>MHLW Guidelines Aligned</span>
              </div>
            </div>
          </Container>
        </section>

        {/* CRC 101 */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {currentContent.crc101.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card className="border-t-4 border-red-500">
                  <CardContent className="p-6">
                    <Heart className="h-12 w-12 text-red-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">
                      {currentContent.crc101.whatIs.title}
                    </h3>
                    <p className="text-gray-600">{currentContent.crc101.whatIs.content}</p>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-orange-500">
                  <CardContent className="p-6">
                    <AlertCircle className="h-12 w-12 text-orange-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">
                      {currentContent.crc101.progression.title}
                    </h3>
                    <p className="text-gray-600">{currentContent.crc101.progression.content}</p>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-green-500">
                  <CardContent className="p-6">
                    <Shield className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">
                      {currentContent.crc101.screening.title}
                    </h3>
                    <p className="text-gray-600">{currentContent.crc101.screening.content}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Visual Aid Placeholder */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-8 text-center">
                <div className="w-full h-64 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Heart className="h-16 w-16 text-red-400 mx-auto mb-2" />
                    <p className="text-red-600 font-medium">
                      大腸・ポリープ発達図 / Colon & Polyp Development Diagram
                    </p>
                    <p className="text-sm text-red-500">ポリープからがんへの進行を示すインタラクティブな視覚</p>
                    <p className="text-xs text-red-400 mt-2">日本語・英語対応</p>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {currentContent.localStats.stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-md text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">{stat.value}</div>
                    <p className="text-gray-700">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Risk Factors */}
              <Card className="border-l-4 border-orange-500">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="h-8 w-8 text-orange-500 mr-3" />
                    {currentContent.riskFactors.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentContent.riskFactors.factors.map((factor, index) => (
                      <div key={index} className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{factor}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* National Health System */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-red-800 to-orange-800 text-white rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-4 flex items-center">
                  <Building className="h-8 w-8 mr-3" />
                  {currentContent.nationalSystem.title}
                </h2>
                <p className="text-lg text-red-100 mb-6">
                  {currentContent.nationalSystem.content}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-red-200 mb-2">
                      {currentLanguage === "ja" ? "保険適用:" : "Insurance Coverage:"}
                    </h4>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-red-100 text-sm">
                        {currentContent.nationalSystem.coverage}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-200 mb-2">
                      {currentLanguage === "ja" ? "全国対応:" : "National Coverage:"}
                    </h4>
                    <div className="flex items-start">
                      <Globe className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-red-100 text-sm">
                        {currentContent.nationalSystem.facilities}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-red-800 to-orange-700 text-white">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">{currentContent.cta.title}</h2>
              <p className="text-xl text-red-100 mb-8">{currentContent.cta.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/specialists"
                  className="inline-flex items-center justify-center rounded-md px-5 py-3 font-medium bg-blue-600 hover:bg-blue-700"
                >
                  {currentContent.cta.buttons.clinic}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a
                  href="/get-screened"
                  className="inline-flex items-center justify-center rounded-md px-5 py-3 font-medium bg-green-600 hover:bg-green-700"
                >
                  {currentContent.cta.buttons.bloodTest}
                </a>
                <a
                  href="/specialists"
                  className="inline-flex items-center justify-center rounded-md px-5 py-3 font-medium border border-white text-white hover:bg-white/10"
                >
                  {currentContent.cta.buttons.specialist}
                </a>
              </div>

              {/* Internal Links */}
              <div className="mt-12 pt-8 border-t border-red-700">
                <p className="text-red-200 mb-4">
                  {currentLanguage === "ja" ? "さらに詳しく:" : "Learn More:"}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <a
                    href="/education/patients/colorectal-cancer"
                    className="text-red-200 hover:text-white underline"
                  >
                    {currentLanguage === "ja"
                      ? "大腸がんを理解する"
                      : "Understanding Colorectal Cancer"}
                  </a>
                  <a href="/get-screened" className="text-red-200 hover:text-white underline">
                    {currentLanguage === "ja" ? "検診を受ける" : "Get Screened"}
                  </a>
                  <a href="/specialists" className="text-red-200 hover:text-white underline">
                    {currentLanguage === "ja" ? "専門医を探す" : "Find Specialists"}
                  </a>
                  <a href="/movement-pillars" className="text-red-200 hover:text-white underline">
                    {currentLanguage === "ja" ? "運動の柱" : "Movement Pillars"}
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
              <p className="text-gray-300">{currentContent.footer}</p>
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
};

export default JapanCRCEducation;
