import LoanPage from "./LoanPage";
import {
  IconIdCard,
  IconPayslip,
  IconBankStatement,
  IconBusinessPlan,
} from "../../components/DocumentIcons";

export default function LoanPersonnel() {
  return (
    <LoanPage
      type="personnel"
      titleKey="loan_per_title"
      taglineKey="prod_per_eyebrow"
      descriptionKey="loan_per_desc_full"
      maxRangeKey="prod_per_range"
      flyerImg="/flyers/flyer-personnel.png"
      documents={[
        { icon: <IconIdCard />, labelKey: "doc_id_label", detailKey: "doc_id_detail" },
        { icon: <IconPayslip />, labelKey: "doc_payslip_label", detailKey: "doc_payslip_detail" },
        { icon: <IconBankStatement />, labelKey: "doc_bank3_label", detailKey: "doc_bank3_detail" },
        { icon: <IconBusinessPlan />, labelKey: "doc_business_label", detailKey: "doc_business_detail" },
      ]}
    />
  );
}


