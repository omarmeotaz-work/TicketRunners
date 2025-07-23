import { StaticPageTemplate } from "./StaticpageTemplate";

export default function TermsAndConditions() {
  return (
    <StaticPageTemplate
      titleKey="termspage.title"
      sections={[
        {
          titleKey: "termspage.section1.title",
          textKey: "termspage.section1.text",
        },
        {
          titleKey: "termspage.section2.title",
          textKey: "termspage.section2.text",
        },
        {
          titleKey: "termspage.section3.title",
          textKey: "termspage.section3.text",
        },
      ]}
    />
  );
}
