import React from 'react';

const LegalInfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-5 group">
    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2 group-hover:text-emerald-700 transition-colors">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
      {title}
    </h3>
    <p className="text-sm text-gray-600 leading-relaxed border-r-2 border-gray-100 pr-3 mr-1">
      {children}
    </p>
  </div>
);

const LegalInfo: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">دليل الأنظمة السعودية</h2>
        <p className="text-xs text-gray-500 mt-1">ملخصات سريعة لأهم القوانين السارية</p>
      </div>
      
      <div className="space-y-2 overflow-y-auto max-h-[700px] custom-scrollbar">
        <LegalInfoSection title="نظام الشركات الجديد">
          دخل حيز التنفيذ في 2023، ويهدف لتعزيز استدامة الشركات. استحدث شكلاً جديداً للشركات (شركة المساهمة المبسطة) وأتاح تقسيم الأسهم وسمح للشركات العائلية بوضع ميثاق عائلي ينظم الملكية.
        </LegalInfoSection>

        <LegalInfoSection title="نظام العمل">
          ينظم العلاقة التعاقدية. تم تحديثه ليشمل أنماط العمل الحديثة، وحماية الأجور، وتنظيم ساعات العمل الإضافي. يحدد النظام حقوق المرأة العاملة وإجازات الوضع والعدة.
        </LegalInfoSection>

        <LegalInfoSection title="نظام الأحوال الشخصية">
          نقلة نوعية في التشريع الأسري. يحدد السن الأدنى للزواج بـ 18 عاماً، وينظم حقوق الحضانة لترجيح مصلحة المحضون، ويضمن حقوق المرأة في النفقة والسكن بعد الطلاق.
        </LegalInfoSection>
        
        <LegalInfoSection title="نظام المعاملات المدنية">
          يُعد المرجع الأساسي لجميع التعاملات المدنية والعقود. يغطي أحكام العقود والضمان (المسؤولية التقصيرية) والملكية، ويعزز استقرار التعاملات المالية ويقلل من تباين الأحكام القضائية.
        </LegalInfoSection>
        
        <LegalInfoSection title="الجرائم المعلوماتية">
          يكافح الجرائم المرتكبة عبر الإنترنت مثل التشهير، الاختراق، والاحتيال المالي. يفرض عقوبات صارمة تشمل السجن والغرامات لحماية الخصوصية والأمن الرقمي.
        </LegalInfoSection>
      </div>

      <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-xs text-amber-800 leading-tight">
              <strong>إخلاء مسؤولية:</strong> المحتوى المقدم من الذكاء الاصطناعي هو لأغراض استرشادية فقط. القوانين تتحدث باستمرار. لأي إجراء قانوني، يجب الاعتماد على النصوص الرسمية واستشارة محامٍ مرخص.
          </p>
      </div>
    </div>
  );
};

export default LegalInfo;