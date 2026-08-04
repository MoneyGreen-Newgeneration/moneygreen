import LoanPage from "./LoanPage";
import {
  IconPayslip,
  IconSchoolAdmission,
  IconResidenceProof,
} from "../../components/DocumentIcons";

export default function LoanScolaire() {
  return (
    <LoanPage
      type="scolaire"
      titleKey="loan_sco_title"
      taglineKey="prod_sco_eyebrow"
      descriptionKey="loan_sco_desc_full"
      maxRangeKey="prod_sco_range"
      documents={[
        { icon: <IconPayslip />, labelKey: "doc_payslip_label", detailKey: "doc_payslip_detail" },
        { icon: <IconSchoolAdmission />, labelKey: "doc_school_label", detailKey: "doc_school_detail" },
        { icon: <IconResidenceProof />, labelKey: "doc_residence_label", detailKey: "doc_residence_detail" },
      ]}
    />
  );
}


