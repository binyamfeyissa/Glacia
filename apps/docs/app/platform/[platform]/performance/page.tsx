import { sectionMeta, sectionPage } from "../../../../components/section-page";

export const generateStaticParams = sectionMeta("performance").generateStaticParams;
export const generateMetadata = sectionMeta("performance").generateMetadata;

export default sectionPage("performance");
