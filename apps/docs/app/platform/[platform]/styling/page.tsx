import { sectionMeta, sectionPage } from "../../../../components/section-page";

export const generateStaticParams = sectionMeta("styling").generateStaticParams;
export const generateMetadata = sectionMeta("styling").generateMetadata;

export default sectionPage("styling");
