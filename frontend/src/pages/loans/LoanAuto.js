import LoanPage from "./LoanPage";
import {
  IconIdCard,
  IconPayslip,
  IconBankStatement,
  IconVehicleQuote,
} from "../../components/DocumentIcons";

export default function LoanAuto() {
  return (
    <LoanPage
      type="auto"
      titleKey="loan_auto_title"
      taglineKey="prod_auto_eyebrow"
      descriptionKey="loan_auto_desc_full"
      maxRangeKey="prod_auto_range"
      flyerImg="/flyers/flyer-auto.jpg"
      documents={[
        { icon: <IconIdCard />, labelKey: "doc_id_label", detailKey: "doc_id_detail" },
        { icon: <IconPayslip />, labelKey: "doc_payslip_label", detailKey: "doc_payslip_detail" },
        { icon: <IconBankStatement />, labelKey: "doc_bank3_label", detailKey: "doc_bank3_detail" },
        { icon: <IconVehicleQuote />, labelKey: "doc_vehicle_label", detailKey: "doc_vehicle_detail" },
      ]}
    />
  );
}

