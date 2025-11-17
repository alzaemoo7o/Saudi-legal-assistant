import React from 'react';

const LegalInfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-emerald-500 pb-2 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{children}</p>
  </div>
);

const LegalInfo: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">معلومات قانونية (المملكة العربية السعودية)</h2>
      
      <LegalInfoSection title="قانون الشركات">
        ينظم قانون الشركات الجديد في المملكة العربية السعودية، الذي دخل حيز التنفيذ في أوائل عام 2023، جميع أشكال الكيانات التجارية ويهدف إلى تسهيل بيئة الأعمال وجذب الاستثمارات.
      </LegalInfoSection>

      <LegalInfoSection title="قانون العمل">
        يحكم نظام العمل السعودي العلاقة بين أصحاب العمل والموظفين، ويحدد الحقوق والواجبات لكلا الطرفين، بما في ذلك عقود العمل، وساعات العمل، والإجازات، ومكافأة نهاية الخدمة.
      </LegalInfoSection>

      <LegalInfoSection title="قانون الأحوال الشخصية">
        صدر نظام الأحوال الشخصية لتوحيد الأحكام القضائية المتعلقة بالأسرة، مثل الخطبة والزواج والطلاق والنفقة والحضانة، بما يتوافق مع أحكام الشريعة الإسلامية.
      </LegalInfoSection>
      
      <LegalInfoSection title="التشريعات العقارية">
        تشمل الأنظمة العقارية مجموعة من القوانين التي تنظم الملكية العقارية وتسجيلها، والتمويل العقاري، والتطوير، بهدف تعزيز الشفافية وحماية حقوق جميع الأطراف في السوق العقاري.
      </LegalInfoSection>

      <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-sm text-gray-500">
              <strong>إخلاء مسؤولية:</strong> هذه المعلومات هي لأغراض إعلامية عامة فقط وليست بديلاً عن الاستشارة القانونية المتخصصة. للحصول على مشورة قانونية، يرجى استشارة محامٍ مرخص.
          </p>
      </div>
    </div>
  );
};

export default LegalInfo;
