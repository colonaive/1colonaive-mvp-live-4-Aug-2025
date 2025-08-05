import React from 'react';
import SEOLandingTemplate from './SEOLandingTemplate';

const DaChangAiShaZhaPage: React.FC = () => {
  const content = {
    title: '大腸癌篩查新加坡 | 早期發現挽救生命 | 血液檢測服務',
    metaDescription: '新加坡大腸癌篩查服務。衛生科學局批准的血液檢測，結腸鏡檢查選項。立即預約篩查 - 早期發現挽救生命。',
    heroTitle: '新加坡大腸癌篩查服務',
    heroSubtitle: '保護您的健康，選擇新加坡最可信的大腸癌篩查選項。早期發現可以挽救您的生命。',
    benefitsList: [
      '新加坡衛生科學局批准的篩查技術',
      '早期發現大腸癌，90%存活率',
      '非侵入性血液檢測和傳統方法並行',
      '通過綜合診所提供補貼篩查計劃',
      '專業家庭醫生轉介跟進護理',
      '新加坡各地多語言醫療服務提供商'
    ],
    ctaText: {
      primary: '立即預約篩查',
      secondary: '尋找專科醫生',
      tertiary: '獲取血液檢測'
    },
    faqItems: [
      {
        question: '新加坡有哪些大腸癌篩查選項？',
        answer: '新加坡提供多種篩查選項，包括衛生科學局批准的血液檢測、FIT檢測（糞便免疫化學檢測）和結腸鏡檢查。衛生部建議從50歲開始篩查，如有家族史或風險因素則更早開始。'
      },
      {
        question: '新加坡的大腸癌篩查有補貼嗎？',
        answer: '是的，新加坡居民可以通過綜合診所和公立醫院獲得補貼的大腸癌篩查。國家篩查計劃涵蓋FIT檢測和必要時的跟進結腸鏡檢查。'
      },
      {
        question: '我應該多久進行一次大腸癌篩查？',
        answer: '對於平均風險的個人，建議每1-2年進行FIT檢測或每10年進行結腸鏡檢查。您的家庭醫生會根據您的風險因素和家族史推薦最佳篩查時間表。'
      },
      {
        question: '大腸癌的早期症狀有哪些？',
        answer: '早期大腸癌通常沒有症狀，這就是篩查至關重要的原因。警告信號可能包括排便習慣改變、便血、腹痛、不明原因的體重減輕或疲勞。'
      }
    ],
    localizedContent: {
      statsTitle: '新加坡大腸癌統計數據',
      processTitle: '您在新加坡的篩查過程',
      processSteps: [
        '與家庭醫生或綜合診所預約篩查諮詢',
        '完成您選擇的篩查檢測（血液檢測、FIT或結腸鏡檢查）',
        '從您的醫療服務提供商處獲得結果和跟進護理建議'
      ]
    }
  };

  return (
    <SEOLandingTemplate
      keyword="大腸癌篩查"
      language="zh"
      region="Singapore"
      intent="diagnosis"
      category="primary"
      content={content}
    />
  );
};

export default DaChangAiShaZhaPage;