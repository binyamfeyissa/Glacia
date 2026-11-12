import { sectionMeta, sectionPage } from "../../../../components/section-page";

export const generateStaticParams = sectionMeta("components").generateStaticParams;
export const generateMetadata = sectionMeta("components").generateMetadata;

export default sectionPage("components");
