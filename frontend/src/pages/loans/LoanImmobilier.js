import LoanPage from "./LoanPage";
import {
  IconPayslip,
  IconBankStatement,
  IconPropertyTitle,
} from "../../components/DocumentIcons";

export default function LoanImmobilier() {
  return (
    <LoanPage
      type="immobilier"
      titleKey="loan_immo_title"
      taglineKey="prod_immo_eyebrow"
      descriptionKey="loan_immo_desc_full"
      maxRangeKey="prod_immo_range"
      documents={[
        { icon: <IconPayslip />, labelKey: "doc_payslip_label", detailKey: "doc_payslip_detail" },
        { icon: <IconBankStatement />, labelKey: "doc_bank6_label", detailKey: "doc_bank6_detail" },
        { icon: <IconPropertyTitle />, labelKey: "doc_property_label", detailKey: "doc_property_detail" },
      ]}
    />
  );
}

