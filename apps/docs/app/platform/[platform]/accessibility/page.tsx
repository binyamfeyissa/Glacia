import { sectionMeta, sectionPage } from "../../../../components/section-page";

export const generateStaticParams = sectionMeta("accessibility").generateStaticParams;
export const generateMetadata = sectionMeta("accessibility").generateMetadata;

export default sectionPage("accessibility");
