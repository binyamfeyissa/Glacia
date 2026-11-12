import { sectionMeta, sectionPage } from "../../../../components/section-page";

export const generateStaticParams = sectionMeta("charts").generateStaticParams;
export const generateMetadata = sectionMeta("charts").generateMetadata;

export default sectionPage("charts");
