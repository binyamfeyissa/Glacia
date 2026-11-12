import { sectionMeta, sectionPage } from "../../../../components/section-page";

export const generateStaticParams = sectionMeta("troubleshooting").generateStaticParams;
export const generateMetadata = sectionMeta("troubleshooting").generateMetadata;

export default sectionPage("troubleshooting");
