import { sectionMeta, sectionPage } from "../../../../components/section-page";

export const generateStaticParams = sectionMeta("sizing").generateStaticParams;
export const generateMetadata = sectionMeta("sizing").generateMetadata;

export default sectionPage("sizing");
