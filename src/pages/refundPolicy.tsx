import { StaticPageTemplate } from "./StaticpageTemplate";

export default function RefundPolicy() {
  return (
    <StaticPageTemplate
      titleKey="refund.title"
      sections={[
        {
          titleKey: "refund.eligibility.title",
          textKey: "refund.eligibility.text",
        },
        { titleKey: "refund.process.title", textKey: "refund.process.text" },
        {
          titleKey: "refund.exceptions.title",
          textKey: "refund.exceptions.text",
        },
      ]}
    />
  );
}
